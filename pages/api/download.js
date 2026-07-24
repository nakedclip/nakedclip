// pages/api/download.js
// السيرفر (Serverless Function) بياخد لينك التيك توك من الفرونت اند
// وبيبعته لـ tikwm.com (خدمة مجانية) عشان يجيب رابط الفيديو بدون علامة مائية.
// السبب في وجود الخطوة دي (بدل ما الفرونت اند يتكلم مع tikwm مباشرة) هو تجنب مشاكل CORS
// وإخفاء التفاصيل الداخلية عن المستخدم.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.body || {};

  if (!url || typeof url !== "string" || !url.includes("tiktok.com")) {
    return res.status(400).json({ error: "من فضلك ادخل لينك تيك توك صحيح" });
  }

  try {
    const tikwmResponse = await fetch("https://www.tikwm.com/api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ url, hd: "1" }).toString(),
    });

    const data = await tikwmResponse.json();

    if (data.code !== 0 || !data.data) {
      return res.status(422).json({
        error: "متقدرش أجيب الفيديو ده، اتأكد من اللينك أو جرب فيديو تاني",
      });
    }

    const info = data.data;

    return res.status(200).json({
      title: info.title || "",
      author: info.author?.nickname || "",
      cover: info.cover || "",
      // رابط الفيديو من غير علامة مائية
      videoUrl: info.play || info.hdplay || "",
      videoUrlHD: info.hdplay || info.play || "",
      audioUrl: info.music || "",
      duration: info.duration || 0,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "حصل خطأ في السيرفر، حاول تاني بعد شوية" });
  }
}
