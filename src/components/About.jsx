import React from 'react';
import styled from 'styled-components';
import { Container, Typography } from '@mui/material';


const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 50px 0;
  flex-grow: 1; // Allow the container to grow and push the footer down
  min-height: calc(100vh - 100px); // Adjust for footer height (thay đổi 100px tùy theo chiều cao footer của bạn)
`;

const Image = styled.img`
  width: 100%; // Đặt chiều rộng là 100% để phù hợp với màn hình
  max-width: 1500px; // Giới hạn chiều rộng tối đa
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const About = () => {
  return (
    <StyledContainer maxWidth="md">
      <Image src="https://farm.vinathis.com/images/banner2.jpg" alt="MRS. Farm" />
      <Typography variant="h4" component="h1" gutterBottom>
        Giới thiệu về Mrs. Hang Farm
      </Typography>
      <Typography variant="body1">
      Mrs. Hang Farm là một farmstay độc đáo, nơi bạn không chỉ tận hưởng không gian yên bình giữa thiên nhiên mà còn được trải nghiệm những sản phẩm nông sản chất lượng cao. Chúng tôi tự hào cung cấp thực phẩm tươi ngon, giàu dinh dưỡng, giúp nâng cao sức khỏe cho cộng đồng. Với cam kết sử dụng các phương pháp canh tác bền vững và thân thiện với môi trường, MRS. Farm mang đến cho bạn không chỉ là những sản phẩm tốt nhất mà còn là một lối sống xanh và bền vững.
      </Typography>
    
    </StyledContainer>
    
  );
};

export default About;
