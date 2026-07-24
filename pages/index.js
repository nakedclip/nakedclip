import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleDownload(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!url.trim()) {
      setError("من فضلك الصق لينك الفيديو الأول");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "حصل خطأ، حاول تاني");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("مقدرناش نوصل للسيرفر، اتأكد من الاتصال بالإنترنت");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div dir="rtl" style={styles.page}>
      <Head>
        <title>Nakedclip - تحميل فيديوهات تيك توك بدون علامة مائية</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main style={styles.main}>
        <h1 style={styles.title}>Nakedclip</h1>
        <p style={{ ...styles.subtitle, marginBottom: "4px" }}>
          تحميل فيديوهات TikTok بدون علامة مائية
        </p>
        <p style={styles.subtitle}>
          الصق لينك الفيديو من تيك توك، واحصل على نسخة نضيفة بدون شعار
        </p>

        <form onSubmit={handleDownload} style={styles.form}>
          <input
            type="text"
            placeholder="https://www.tiktok.com/@username/video/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "جاري التحميل..." : "تحميل"}
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}

        {result && (
          <div style={styles.resultCard}>
            {result.cover && (
              <img src={result.cover} alt="cover" style={styles.cover} />
            )}
            <div>
              <p style={styles.videoTitle}>{result.title || "بدون عنوان"}</p>
              {result.author && (
                <p style={styles.author}>بواسطة: {result.author}</p>
              )}
              <div style={styles.linksRow}>
                <a
                  href={result.videoUrlHD}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.downloadBtn}
                >
                  تحميل الفيديو (بدون علامة مائية)
                </a>
                {result.audioUrl && (
                  <a
                    href={result.audioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.downloadBtnSecondary}
                  >
                    تحميل الصوت فقط
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        <p style={styles.note}>
          الأداة دي لأغراض شخصية وتعليمية. من فضلك احترم حقوق الملكية الفكرية
          لصانعي المحتوى وشروط استخدام تيك توك.
        </p>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fe2c55 0%, #25f4ee 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    fontFamily: "Tahoma, Arial, sans-serif",
  },
  main: {
    background: "#fff",
    borderRadius: "20px",
    padding: "40px 32px",
    maxWidth: "480px",
    width: "100%",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    color: "#161823",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#75757a",
    marginBottom: "24px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #e2e2e2",
    fontSize: "15px",
    outline: "none",
  },
  button: {
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "#fe2c55",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  error: {
    color: "#fe2c55",
    marginTop: "16px",
    fontSize: "14px",
  },
  resultCard: {
    marginTop: "24px",
    padding: "16px",
    borderRadius: "12px",
    background: "#f8f8f8",
    display: "flex",
    gap: "16px",
    alignItems: "center",
    textAlign: "right",
  },
  cover: {
    width: "90px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  videoTitle: {
    fontSize: "14px",
    color: "#161823",
    marginBottom: "6px",
  },
  author: {
    fontSize: "13px",
    color: "#75757a",
    marginBottom: "10px",
  },
  linksRow: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  downloadBtn: {
    background: "#25f4ee",
    color: "#161823",
    padding: "8px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center",
  },
  downloadBtnSecondary: {
    background: "#eee",
    color: "#161823",
    padding: "8px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    textDecoration: "none",
    textAlign: "center",
  },
  note: {
    marginTop: "24px",
    fontSize: "12px",
    color: "#a0a0a5",
    lineHeight: "1.6",
  },
};
