"use client";
/* eslint-disable react-hooks/purity, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GalaxyCanvas } from "../src/components/GalaxyCanvas";
import { PRESETS, analyzeText, decodeUniverse, encodeUniverse, generateUniverse, type EmotionVector, type Universe } from "../src/generation/universe";

const initial = PRESETS.Calm;
const sliders: (keyof EmotionVector)[] = ["joy", "calm", "energy", "tension", "nostalgia", "wonder", "loneliness", "chaos"];

export default function Home() {
  const [preset, setPreset] = useState("Calm");
  const [emotion, setEmotion] = useState<EmotionVector>(initial.vector);
  const [seed, setSeed] = useState("stillwater-27");
  const [paused, setPaused] = useState(false);
  const [quiet, setQuiet] = useState(false);
  const [performance, setPerformance] = useState(false);
  const [muted, setMuted] = useState(true);
  const [text, setText] = useState("");
  const [selected, setSelected] = useState<Universe["planets"][number] | null>(null);
  const [help, setHelp] = useState(false);
  const [toast, setToast] = useState("");
  const [reduced, setReduced] = useState(false);
  const screenshot = useRef<() => void>(() => {});
  const universe = useMemo(() => generateUniverse(seed, emotion, preset), [seed, emotion, preset]);

  const announce = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2600); };
  const choose = (name: string) => { const p = PRESETS[name]; setPreset(name); setEmotion(p.vector); setSelected(null); setSeed(`${name.toLowerCase()}-${Date.now().toString(36).slice(-5)}`); };
  const regenerate = () => { setSeed(`${preset.toLowerCase()}-${Date.now().toString(36).slice(-6)}`); setSelected(null); announce("A new universe is unfolding."); };
  const applyText = () => { if (!text.trim()) return; setPreset("Custom"); setEmotion(analyzeText(text)); setSeed(`inner-${encodeURIComponent(text.trim().toLowerCase()).slice(0, 14)}`); announce("Artistic emotional fingerprint applied."); };
  const share = async () => { const url = `${location.origin}${location.pathname}?u=${encodeUniverse({ seed, emotion, preset })}`; history.replaceState(null, "", url); try { await navigator.clipboard.writeText(url); announce("Share link copied."); } catch { prompt("Copy this link", url); } };
  const download = (name: string, value: string, type = "application/json") => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([value], { type })); a.download = name; a.click(); URL.revokeObjectURL(a.href); };
  const importJson = (file?: File) => { if (!file) return; const reader = new FileReader(); reader.onload = () => { try { const u = JSON.parse(String(reader.result)); setSeed(u.seed); setPreset(u.preset); setEmotion(u.emotion); announce("Universe imported."); } catch { announce("That universe file could not be read."); } }; reader.readAsText(file); };

  useEffect(() => { const saved = decodeUniverse(new URLSearchParams(location.search).get("u")); if (saved) { setSeed(saved.seed); setPreset(saved.preset); setEmotion(saved.emotion); } setReduced(matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);
  useEffect(() => { const key = (e: KeyboardEvent) => { if ((e.target as HTMLElement)?.tagName === "INPUT") return; if (e.key === " ") { e.preventDefault(); setPaused(v => !v); } if (e.key.toLowerCase() === "r") regenerate(); if (e.key.toLowerCase() === "s") screenshot.current(); if (e.key.toLowerCase() === "m") setMuted(v => !v); if (e.key.toLowerCase() === "f") document.documentElement.requestFullscreen?.(); if (e.key === "Escape") { setSelected(null); setHelp(false); } if (e.key === "/") { e.preventDefault(); document.getElementById("emotion-input")?.focus(); } }; addEventListener("keydown", key); return () => removeEventListener("keydown", key); }, [preset]);

  return <main className={quiet ? "quiet" : ""}>
    <GalaxyCanvas universe={universe} paused={paused || reduced} performance={performance} onPlanet={setSelected} onScreenshot={(fn) => screenshot.current = fn} />
    <div className="grain" aria-hidden="true" />
    <header className="topbar"><div><span className="eyebrow">GENERATIVE EMOTIONAL UNIVERSE</span><h1>MOOD <i>GALAXY</i></h1></div><div className="header-actions"><span className="emotion-pill">{preset}</span><button onClick={() => setMuted(v => !v)} aria-label="Toggle sound">{muted ? "Sound off" : "Sound on"}</button><button onClick={() => document.documentElement.requestFullscreen?.()} aria-label="Fullscreen">Fullscreen</button><button onClick={() => setHelp(true)} aria-label="Keyboard help">?</button></div></header>
    <section className="intro"><p className="eyebrow">{universe.galaxyTitle}</p><h2>What does your<br /><em>inner world</em> look like?</h2><p>{universe.interpretation}</p></section>
    <aside className="narrative"><span>TRANSMISSION 01</span><strong>{universe.name}</strong><p>{universe.message}</p></aside>
    <section className="dock" aria-label="Universe controls"><div className="presets">{Object.keys(PRESETS).map(p => <button className={preset === p ? "active" : ""} key={p} onClick={() => choose(p)}>{p}</button>)}</div><div className="composer"><input id="emotion-input" value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && applyText()} placeholder="Describe what you feel..." aria-label="Describe an emotion" /><button onClick={applyText}>Interpret</button></div><div className="sliders">{sliders.map(k => <label key={k}>{k}<input aria-label={k} type="range" min="0" max="1" step=".01" value={emotion[k]} onChange={e => { setPreset("Custom"); setEmotion({ ...emotion, [k]: +e.target.value }); }} /></label>)}</div><div className="actions"><button onClick={regenerate}>Regenerate</button><button onClick={() => setPaused(v => !v)}>{paused ? "Resume" : "Freeze"}</button><button onClick={share}>Share</button><button onClick={() => screenshot.current()}>Screenshot</button><button onClick={() => download("mood-galaxy.json", JSON.stringify({ seed, emotion, preset, generationVersion: 1, timestamp: new Date().toISOString(), notes: text }, null, 2))}>Export</button><label className="file">Import<input type="file" accept="application/json" onChange={e => importJson(e.target.files?.[0])} /></label><button onClick={() => setQuiet(v => !v)}>{quiet ? "Controls" : "Quiet"}</button><button onClick={() => setPerformance(v => !v)}>{performance ? "Full quality" : "Performance"}</button></div></section>
    <AnimatePresence>{selected && <motion.aside className="detail" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}><button className="close" onClick={() => setSelected(null)}>×</button><span>DISCOVERED BODY</span><h3>{selected.name}</h3><p>{selected.lore}</p><dl><div><dt>Archetype</dt><dd>{selected.archetype}</dd></div><div><dt>Orbit</dt><dd>{selected.orbit.toFixed(1)} AU</dd></div></dl></motion.aside>}</AnimatePresence>
    <AnimatePresence>{help && <motion.dialog open className="help" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><button className="close" onClick={() => setHelp(false)}>×</button><span>INSTRUMENT GUIDE</span><h3>Explore by instinct.</h3><p>Drag to orbit. Click a world to receive its story.</p><p><kbd>Space</kbd> freeze &nbsp; <kbd>R</kbd> regenerate &nbsp; <kbd>S</kbd> screenshot &nbsp; <kbd>M</kbd> sound &nbsp; <kbd>/</kbd> search</p></motion.dialog>}</AnimatePresence>
    <p className="disclaimer">An artistic interpretation — not an emotional assessment.</p><div className="live" aria-live="polite">{toast}</div>
  </main>;
}
