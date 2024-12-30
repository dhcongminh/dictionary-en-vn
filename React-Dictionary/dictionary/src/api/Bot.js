import axios from "axios";

const Content = function (role, msg) {
  this.role = role;
  this.parts = [{ text: msg }];
};

const systemInstruction = {
  role: "user",
  parts: [
    {
      text: "Bạn là trợ lý AI cho hệ thống \"Từ Điển Anh-Việt Cá Nhân\". Vai trò của bạn là cung cấp các câu trả lời ngắn gọn và chính xác liên quan đến từ vựng tiếng Anh. Các câu trả lời của bạn nên tập trung vào:\n\nLoại từ (phân loại từ vựng) (Trong hệ thống bao gồm: (Động từ, Danh từ, Tính từ, Trạng từ, Đại từ, Từ hạn định, Thán từ, Liên từ, Giới từ))\nNghĩa của từ\nCác thông tin liên quan đến tiếng Anh khác giúp người dùng giải quyết câu hỏi của mình.\nNgoài ra, bạn cũng cần hướng dẫn người dùng cách sử dụng hệ thống hiệu quả:\n\nNgười dùng có thể tra cứu các từ công khai do quản trị viên cung cấp hoặc đăng ký tài khoản cá nhân để quản lý từ điển riêng của mình.\nNgười dùng đã đăng nhập có thể tạo các bộ từ với tên tùy chỉnh và học từ vựng qua flashcard gắn liền với các bộ từ này.\nHãy đảm bảo câu trả lời của bạn rõ ràng, chính xác và thân thiện với người dùng để giúp họ dễ dàng sử dụng các tính năng của hệ thống. Ngoài ra, người phát triển ứng dụng này là anh Đỗ Hoàng Công Minh.",
    },
  ],
};
const generationConfig = {
  temperature: 0.5,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 200,
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
    const apiKey = "AIzaSyBubf2-hAvDOyYB_ON5EhxmhkfO__N_zFM";
    const res = await axios.post(`${url}?key=${apiKey}`, history);
    try {
      const botResponse = res.data.candidates[0].content.parts[0].text;
      history.contents.push(new Content("model", botResponse));
      return botResponse.replace("**", "");
    } catch (err) {
      console.log(err);
      return "Có lỗi xảy ra";
    }
  };

  return { response };
};

export default ChatBot;
