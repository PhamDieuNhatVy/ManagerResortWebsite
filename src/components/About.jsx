import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 ">
      {/* Image Column */}
      
      {/* Information Column */}
      <div className="flex flex-col justify-center space-y-4">
        <h2 className="text-3xl font-bold">
          Giới thiệu về Mrs. Hang Farm
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Mrs. Hang Farm là một farmstay độc đáo, nơi bạn không chỉ tận hưởng không gian yên bình giữa thiên nhiên mà còn được trải nghiệm những sản phẩm nông sản chất lượng cao. Chúng tôi tự hào cung cấp thực phẩm tươi ngon, giàu dinh dưỡng, giúp nâng cao sức khỏe cho cộng đồng. Với cam kết sử dụng các phương pháp canh tác bền vững và thân thiện với môi trường, MRS. Farm mang đến cho bạn không chỉ là những sản phẩm tốt nhất mà còn là một lối sống xanh và bền vững.
        </p>

        {/* Additional Information */}
        <div className="space-y-2">
          <p className="text-lg text-gray-700">
            <strong>Địa chỉ:</strong> Thủ Dầu Một, Bình Dương
          </p>
          <p className="text-lg text-gray-700">
            <strong>Điện thoại:</strong> 0901234567
          </p>
        </div>
      </div>
      <div className="w-full">
        <img 
          src="https://farm.vinathis.com/images/banner2.jpg" 
          alt="MRS. Farm" 
          className="w-full h-72 object-cover rounded-lg shadow-md"
        />
      </div>
      
    </div>
  );
};

export default About;
