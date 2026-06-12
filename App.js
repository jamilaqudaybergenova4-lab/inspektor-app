import { useState } from "react";

const STATIYALAR = [
  { id: 1, kod: "120-statiya 1-bólim", atı: "Qáwipsizlik remenin taqpaǵan", jariyma: 206000, ball: 0.2, emoji: "🪢" },
  { id: 2, kod: "120-statiya 2-bólim", atı: "Dáslepki medicina komplekti / óshirgish joq", jariyma: 206000, ball: 0.2, emoji: "🧯" },
  { id: 3, kod: "121-statiya", atı: "Jol belgilerine boysınbaǵan", jariyma: 206000, ball: 0.3, emoji: "🚧" },
  { id: 4, kod: "122-statiya 1-bólim", atı: "Hújjetsiz júriw", jariyma: 412000, ball: 0, emoji: "📄" },
  { id: 5, kod: "122-statiya 2-bólim", atı: "Camamsız júriw (OSAGO joq)", jariyma: 412000, ball: 0, emoji: "📋" },
  { id: 6, kod: "126-statiya 1-bólim", atı: "Qızıl shıraqtan ótip ketiw", jariyma: 824000, ball: 1.0, emoji: "🚦" },
  { id: 7, kod: "126-statiya 2-bólim", atı: "Qadaǵan etilgen jerde toqtaw", jariyma: 824000, ball: 0.5, emoji: "🅿️" },
  { id: 8, kod: "127-statiya", atı: "Aydaw vaqtında telefon uslaw", jariyma: 1236000, ball: 0.5, emoji: "📱" },
  { id: 9, kod: "128-statiya 1-bólim", atı: "Tezlikti 20 km/s asırıw", jariyma: 412000, ball: 0.5, emoji: "⚡" },
  { id: 10, kod: "128-statiya 2-bólim", atı: "Tezlikti 20–40 km/s asırıw", jariyma: 2060000, ball: 1.0, emoji: "⚡" },
  { id: 11, kod: "128-statiya 3-bólim", atı: "Tezlikti 40 km/s dan artıq asırıw", jariyma: 3708000, ball: 2.0, emoji: "🚨" },
  { id: 12, kod: "129-statiya", atı: "Qarama-qarsı jolǵa shıǵıw", jariyma: 4120000, ball: 1.0, emoji: "⬅️" },
  { id: 13, kod: "130-statiya", atı: "Nomersiz transport quralı", jariyma: 2060000, ball: 0, emoji: "🔲" },
  { id: 14, kod: "131-statiya", atı: "Mas halda aydaw", jariyma: 10300000, ball: 2.0, emoji: "🍷" },
  { id: 15, kod: "132-statiya", atı: "Medicina tekseriwinen bas tartıw", jariyma: 6180000, ball: 2.0, emoji: "🏥" },
  { id: 16, kod: "133-statiya", atı: "Qaza jerinen qashıw", jariyma: 0, ball: 2.0, emoji: "🏃" },
];

const formatSum = (n) => n.toLocaleString("uz-UZ") + " sum";

export default function App() {
  const [step, setStep] = useState(0);
  const [nom, setNom] = useState("");
  const [nomError, setNomError] = useState("");
  const [aydawshi, setAydawshi] = useState(null);
  const [selectedStatiya, setSelectedStatiya] = useState(null);
  const [filter, setFilter] = useState("");
  const [smsJiberildi, setSmsJiberildi] = useState(false);
  const [protokollar, setProtokollar] = useState([]);
  const [inspektor] = useState({ fio: "Yusupov Bahodir", id: "INS-0042", hudud: "Toshkent sh., Yunusobod" });

  const searchAydawshi = () => {
    if (!nom.trim()) { setNomError("Mámleketlik nomerin kiritiń"); return; }
    setNomError("");
    const mock = {
      "01A123AA": { fio: "Aliyev Bobur Kamoliddinovich", tel: "+998 90 123 45 67", guwalıq: "AB1234567", jami_ball: 3.5 },
      "10B456BB": { fio: "Karimova Dilnoza Yusupovna",   tel: "+998 90 765 43 21", guwalıq: "CD7654321", jami_ball: 7.5 },
      "30C789CC": { fio: "Toshmatov Jasur Erkinovich",   tel: "+998 99 112 23 34", guwalıq: "EF9988776", jami_ball: 10.2 },
    };
    const found = mock[nom.toUpperCase()];
    if (found) { setAydawshi({ ...found, mamleketlik_nomeri: nom.toUpperCase() }); setStep(1); }
    else {
      setAydawshi({ fio: "Namálim aydawshı", tel: "+998 90 000 00 00", guwalıq: "—", jami_ball: 0, mamleketlik_nomeri: nom.toUpperCase() });
      setStep(1);
    }
  };

  const selectStatiya = (s) => { setSelectedStatiya(s); setStep(2); };

  const tastıyıqlaw = () => {
    const jana = {
      id: Date.now(),
      aydawshi,
      statiya: selectedStatiya,
      sane: new Date().toLocaleString("uz-UZ"),
      inspektor: inspektor.fio,
      jana_ball: (aydawshi.jami_ball + selectedStatiya.ball).toFixed(1),
    };
    setProtokollar(p => [jana, ...p]);
    setSmsJiberildi(false);
    setStep(3);
  };

  const reset = () => {
    setStep(0); setNom(""); setAydawshi(null); setSelectedStatiya(null); setSmsJiberildi(false);
  };

  const jana_jami = aydawshi && selectedStatiya ? (aydawshi.jami_ball + selectedStatiya.ball) : 0;

  const ballColor = (ball) => {
    if (ball >= 12) return "#dc2626";
    if (ball >= 8) return "#f59e0b";
    return "#16a34a";
  };

  const BallBar = ({ ball }) => {
    const pct = Math.min((ball / 12) * 100, 100);
    return (
      <div style={{ background: "#e5e7eb", borderRadius: 8, height: 10, margin: "6px 0" }}>
        <div style={{ width: `${pct}%`, background: ballColor(ball), height: 10, borderRadius: 8, transition: "width 0.5s" }} />
      </div>
    );
  };

  const SMSPreview = ({ h, s }) => {
    const jami = (h.jami_ball + s.ball).toFixed(1);
    const eskertiw = jami >= 12
      ? "\n⚠️ DIQQAT: 12 ball jıynaldı! Maǵlıwmat sudqa jiberildi."
      : jami >= 8
      ? "\n⚠️ Eskertiw: 8 ballǵa jettińiz. Abaylı bolıń!"
      : "";
    return `✅ E-JARIYMA XABARNAMASI\n\nAydawshı: ${h.fio}\nTransport: ${h.mamleketlik_nomeri}\n\n📋 Statiya: ${s.kod}\nQaýdanı buzıw: ${s.atı}\n\n💰 Jariyma: ${formatSum(s.jariyma)}\n🎯 Qosılǵan ball: +${s.ball}\n📊 Ulıwma ball: ${jami}/12${eskertiw}\n\n🔗 Tólew: e-jarima.uz\n📞 Soraw: 1201`;
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)", fontFamily: "'Segoe UI', sans-serif", padding: "0 0 40px 0" }}>

      {/* Header */}
      <div style={{ background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ background: "#3b82f6", borderRadius: 10, width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🚔</div>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, letterSpacing: 0.5 }}>JXQ Inspektor Plansheti</div>
          <div style={{ color: "#94a3b8", fontSize: 12 }}>{inspektor.fio} · {inspektor.hudud}</div>
        </div>
        <div style={{ marginLeft: "auto", background: "#22c55e", borderRadius: 6, padding: "4px 10px", color: "#fff", fontSize: 12, fontWeight: 600 }}>● JONLI</div>
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", padding: "16px 20px", gap: 6 }}>
        {["Transport", "Statiya", "Tastıyıqlaw", "SMS"].map((label, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ height: 4, borderRadius: 2, background: i <= step ? "#3b82f6" : "rgba(255,255,255,0.15)", transition: "background 0.3s" }} />
            <div style={{ color: i <= step ? "#93c5fd" : "#475569", fontSize: 10, marginTop: 4, fontWeight: i === step ? 700 : 400 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "0 16px" }}>

        {/* STEP 0 */}
        {step === 0 && (
          <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: 24, backdropFilter: "blur(8px)" }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 20, marginBottom: 6 }}>Mámleketlik nomerin kiritiń</div>
            <div style={{ color: "#94a3b8", fontSize: 14, marginBottom: 20 }}>Uslanıp toqtatılǵan transport maǵlıwmatların anıqlaw</div>
            <input
              value={nom}
              onChange={e => setNom(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === "Enter" && searchAydawshi()}
              placeholder="Mısalı: 01A123AA"
              style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: nomError ? "2px solid #ef4444" : "2px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: 20, fontWeight: 700, letterSpacing: 2, outline: "none", boxSizing: "border-box", textAlign: "center" }}
            />
            {nomError && <div style={{ color: "#f87171", fontSize: 13, marginTop: 6 }}>{nomError}</div>}
            <div style={{ color: "#475569", fontSize: 12, textAlign: "center", margin: "10px 0" }}>Sınaw ushın: 01A123AA · 10B456BB · 30C789CC</div>
            <button onClick={searchAydawshi} style={{ width: "100%", padding: "14px", background: "#3b82f6", border: "none", borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>
              🔍 Izlew
            </button>
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && aydawshi && (
          <div>
            <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: 18, marginBottom: 16, backdropFilter: "blur(8px)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ color: "#94a3b8", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Aydawshı anıqlandı</div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginTop: 4 }}>{aydawshi.fio}</div>
                  <div style={{ color: "#60a5fa", fontWeight: 700, fontSize: 18, marginTop: 2 }}>{aydawshi.mamleketlik_nomeri}</div>
                  <div style={{ color: "#94a3b8", fontSize: 13 }}>Guwalıq: {aydawshi.guwalıq}</div>
                  <div style={{ color: "#94a3b8", fontSize: 13 }}>{aydawshi.tel}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#94a3b8", fontSize: 11 }}>Házirgi ball</div>
                  <div style={{ color: ballColor(aydawshi.jami_ball), fontWeight: 800, fontSize: 28 }}>{aydawshi.jami_ball}</div>
                  <div style={{ color: "#475569", fontSize: 11 }}>/ 12</div>
                </div>
              </div>
              <BallBar ball={aydawshi.jami_ball} />
              {aydawshi.jami_ball >= 8 && <div style={{ background: "#f59e0b22", border: "1px solid #f59e0b", borderRadius: 8, padding: "8px 12px", color: "#fbbf24", fontSize: 13, marginTop: 8 }}>⚠️ Bul aydawshı {aydawshi.jami_ball} ball jıynaǵan — SMS eskertiw jiberilgen</div>}
            </div>

            <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="🔍 Qaýdanı buzıwdı izleń..." style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.07)", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12 }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {STATIYALAR.filter(s => s.atı.toLowerCase().includes(filter.toLowerCase()) || s.kod.includes(filter)).map(s => (
                <button key={s.id} onClick={() => selectStatiya(s)}
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "14px 16px", cursor: "pointer", textAlign: "left" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(59,130,246,0.2)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 22 }}>{s.emoji}</span>
                      <div>
                        <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{s.atı}</div>
                        <div style={{ color: "#60a5fa", fontSize: 12, marginTop: 2 }}>{s.kod}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", minWidth: 90 }}>
                      <div style={{ color: "#f87171", fontWeight: 700, fontSize: 13 }}>{formatSum(s.jariyma)}</div>
                      {s.ball > 0 && <div style={{ background: "#3b82f622", border: "1px solid #3b82f6", borderRadius: 6, padding: "2px 8px", color: "#60a5fa", fontSize: 12, marginTop: 3 }}>+{s.ball} ball</div>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && aydawshi && selectedStatiya && (
          <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: 24, backdropFilter: "blur(8px)" }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 20, marginBottom: 20 }}>Protokoldı tastıyıqlaw</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                ["👤 Aydawshı", aydawshi.fio],
                ["🚗 Transport", aydawshi.mamleketlik_nomeri],
                ["📋 Statiya", selectedStatiya.kod],
                ["⚠️ Qaýdanı buzıw", selectedStatiya.atı],
                ["💰 Jariyma", formatSum(selectedStatiya.jariyma)],
                ["👮 Inspektor", inspektor.fio],
                ["📍 Hudud", inspektor.hudud],
              ].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 10 }}>
                  <span style={{ color: "#94a3b8", fontSize: 14 }}>{label}</span>
                  <span style={{ color: "#fff", fontWeight: 600, fontSize: 14, textAlign: "right", maxWidth: "60%" }}>{val}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.4)", borderRadius: 12, padding: 16, marginTop: 16 }}>
              <div style={{ color: "#93c5fd", fontWeight: 700, marginBottom: 8 }}>📊 Ball ózgerisi</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "#94a3b8", fontSize: 12 }}>Házir</div>
                  <div style={{ color: "#fff", fontWeight: 800, fontSize: 28 }}>{aydawshi.jami_ball}</div>
                </div>
                <div style={{ color: "#f59e0b", fontSize: 24, fontWeight: 700 }}>+{selectedStatiya.ball}</div>
                <div style={{ color: "#94a3b8", fontSize: 20 }}>→</div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "#94a3b8", fontSize: 12 }}>Jańa</div>
                  <div style={{ color: ballColor(jana_jami), fontWeight: 800, fontSize: 28 }}>{jana_jami.toFixed(1)}</div>
                </div>
                <div style={{ color: "#475569", fontSize: 14 }}>/ 12</div>
              </div>
              <BallBar ball={jana_jami} />
              {jana_jami >= 12 && <div style={{ color: "#f87171", fontWeight: 700, textAlign: "center", fontSize: 14 }}>🚨 12 ball toldı — Maǵlıwmat sudqa jiberiledi!</div>}
              {jana_jami >= 8 && jana_jami < 12 && <div style={{ color: "#fbbf24", fontWeight: 600, textAlign: "center", fontSize: 14 }}>⚠️ 8 ballǵa jetti — SMS eskertiw jiberiledi</div>}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: "14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, color: "#fff", fontSize: 15, cursor: "pointer" }}>← Artqa</button>
              <button onClick={tastıyıqlaw} style={{ flex: 2, padding: "14px", background: "#3b82f6", border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>✅ Tastıyıqlaw hám SMS jiberiw</button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && aydawshi && selectedStatiya && (
          <div>
            <div style={{ background: "#16a34a22", border: "1px solid #16a34a", borderRadius: 16, padding: 20, marginBottom: 16, textAlign: "center" }}>
              <div style={{ fontSize: 40 }}>✅</div>
              <div style={{ color: "#4ade80", fontWeight: 700, fontSize: 18 }}>Protokol tabıslı jaratıldı!</div>
              <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>SMS xabarnama aydawshı telefonına jiberilmekte...</div>
            </div>

            <div style={{ background: "#1e293b", borderRadius: 16, padding: 20, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ background: "#25d366", borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📱</div>
                <div>
                  <div style={{ color: "#fff", fontWeight: 700 }}>SMS Xabarnama</div>
                  <div style={{ color: "#94a3b8", fontSize: 12 }}>→ {aydawshi.tel}</div>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  {!smsJiberildi
                    ? <button onClick={() => setSmsJiberildi(true)} style={{ background: "#25d366", border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>📤 Jiberiw</button>
                    : <div style={{ background: "#16a34a22", border: "1px solid #16a34a", borderRadius: 8, padding: "6px 12px", color: "#4ade80", fontSize: 12, fontWeight: 700 }}>✓ Jiberildi</div>
                  }
                </div>
              </div>
              <pre style={{ background: "#0f172a", borderRadius: 12, padding: 16, color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "monospace", margin: 0 }}>
                {SMSPreview({ h: aydawshi, s: selectedStatiya })}
              </pre>
            </div>

            <button onClick={reset} style={{ width: "100%", padding: "14px", background: "#3b82f6", border: "none", borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
              ＋ Jańa protokol
            </button>

            {protokollar.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <div style={{ color: "#94a3b8", fontWeight: 700, fontSize: 14, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Búgingi protokollar ({protokollar.length})</div>
                {protokollar.map(p => (
                  <div key={p.id} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 14, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{p.aydawshi.mamleketlik_nomeri}</div>
                      <div style={{ color: "#94a3b8", fontSize: 12 }}>{p.statiya.atı}</div>
                      <div style={{ color: "#475569", fontSize: 11 }}>{p.sane}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: "#f87171", fontWeight: 700 }}>{formatSum(p.statiya.jariyma)}</div>
                      <div style={{ color: ballColor(parseFloat(p.jana_ball)), fontSize: 12 }}>{p.jana_ball}/12 ball</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
   }
