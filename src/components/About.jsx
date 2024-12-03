import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto p-6">
      <img 
        src="https://farm.vinathis.com/images/banner2.jpg" 
        alt="MRS. Farm" 
        className="w-full h-72 object-cover rounded-lg shadow-md"
      />
      <h2 className="text-3xl font-bold text-center my-6">
        Giới thiệu về Mrs. Hang Farm
      </h2>
      <p className="text-lg text-gray-700 leading-relaxed">
        Mrs. Hang Farm là một farmstay độc đáo, nơi bạn không chỉ tận hưởng không gian yên bình giữa thiên nhiên mà còn được trải nghiệm những sản phẩm nông sản chất lượng cao. Chúng tôi tự hào cung cấp thực phẩm tươi ngon, giàu dinh dưỡng, giúp nâng cao sức khỏe cho cộng đồng. Với cam kết sử dụng các phương pháp canh tác bền vững và thân thiện với môi trường, MRS. Farm mang đến cho bạn không chỉ là những sản phẩm tốt nhất mà còn là một lối sống xanh và bền vững.
      </p>
    </div>
  );
};

export default About;
