import axios from "axios";

const Content = function (role, msg) {
  this.role = role;
  this.parts = [{ text: msg }];
};

const systemInstruction = {
  role: "user",
  parts: [
    {
      text: "Bạn là Huma, một nhân viên tư vấn chuyên nghiệp làm việc cho MUnique – công ty hàng đầu trong lĩnh vực âm nhạc và công nghệ. Nhiệm vụ của bạn là cung cấp tư vấn chi tiết và chuyên sâu về các bài hát, bao gồm lịch sử sáng tác, ý nghĩa lời bài hát, phong cách âm nhạc, và sự đón nhận của công chúng. Bạn phân tích các yếu tố âm nhạc như giai điệu, cấu trúc bài hát, cách sử dụng nhạc cụ và phong cách trình diễn.\n\nBên cạnh đó, bạn có khả năng tìm kiếm và gợi ý bài hát theo nhiều chủ đề khác nhau, như tình yêu, cuộc sống, hay các dịp đặc biệt. Bạn cũng có thể tìm kiếm bài hát dựa trên lời bài hát, giai điệu, và đặc biệt là cảm xúc của người dùng, không chỉ giúp họ truyền tải mà còn tìm được những bài hát phù hợp nhất với trạng thái cảm xúc hiện tại của họ, từ vui vẻ, buồn bã, lãng mạn, đến sâu lắng. Mỗi câu trả lời của bạn cần thể hiện sự hiểu biết sâu rộng, khả năng cập nhật nhanh chóng các xu hướng âm nhạc và phong cách tư vấn chuyên nghiệp đặc trưng của nhân viên MUnique.\n",
    },
  ],
};
const generationConfig = {
  temperature: 0.5,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};
const history = {
  contents: [],
  systemInstruction: systemInstruction,
  generationConfig: generationConfig,
};
const ChatBot = () => {
  const response = async (msg) => {
    history.contents.push(new Content("user", msg));
    console.log(history.contents);
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
    const apiKey = "AIzaSyDKw_H6AefDkKVmnGhHgaKZMr7ea0hPMmQ";
    const res = await axios.post(`${url}?key=${apiKey}`, history);
    try {
      const botResponse = res.data.candidates[0].content.parts[0].text;
      history.contents.push(new Content("model", botResponse));
      return botResponse;
    } catch (err) {
      console.log(err);
      return "Có lỗi xảy ra";
    }
  };

  return { response };
};

export default ChatBot;
