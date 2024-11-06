import styled from 'styled-components';

const Wrapper = styled.section`
  .landing-container {
    background: #FFF8F8;
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    padding: 10px;
  }

  .landing-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #FFF8F8;
  }

  .landing-doublebutton {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #FFF8F8;    
  }

  .logo-img {
    height: 58px;
  }

  .header-text {
    font-family: 'Train One', cursive;
    font-size: 40px;
    color: #102c57ff;
    margin-left: 10px;
  }

  .header-button {
    margin-left: auto;
    margin-right: 10px;
    text-align: center;
    background-color: #102C57;
    border: none;
    color: #ffffff;
    padding: 10px 20px;
    border-radius: 30px;
  }

  .register-link {
    margin-right: 1rem;
  }

  .main-img {
    width: 100%;
  }

  .nav-bar {
    display: flex;
    justify-content: center;
    border-radius: 10px;
    overflow: hidden;
  }

  .nav-section {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    font-size: 28px;
    font-weight: bold;
    color: #FFFFFF;
  }

  .greeting {
    background-color: #E98080;
    flex: 2;
  }

  .home {
    background-color: #102C57;
    flex: 1;
  }

  .nav-button {
    background-color: #102c57d1;
    color: #ffffff;
    border: none;
    padding: 10px 20px;
    border-radius: 30px;
    margin: 0 10px;
  }

  .section {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    flex-wrap: wrap;
  }

  .card {
    width: 48%;
    height: auto;
    background-color: #F3E9E3;
    border-radius: 10px;
    box-shadow: 0px 0px 5px #bdbdbd;
    padding: 20px;
    margin-bottom: 20px;
  }

  .card-text {
    color: #a45921ff;
    font-size: 28px;
    font-weight: bold;
  }

  .section-img {
    width: 100%;
    margin: 20px 0;
    border-radius: 10px;
    display: block;
  }

  .quote-section {
    text-align: center;
    margin: 40px 0;
  }

  .quote {
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: 33px;
    color: #1e293bff;
  }

  .paragraph {
    font-family: 'Rubik', sans-serif;
    font-size: 20px;
    font-weight: 400;
    color: #1e293bff;
  }

  .time-img-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
  }

  .time-img {
    width: 100%;
  }

  .landing-footer {
    background-color: #333;
    color: #fff;
    padding: 20px 0;
    border-radius: 10px;
    font-family: Arial, sans-serif;
  }

  .footer-content {
    display: flex;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    gap: 20px; 
  }

  .footer-section {
    flex: 1; 
    margin: 0; 
  }

  .footer-section.about {
    flex: 3; 
  }

  .footer-section.logo {
  flex: 2;
  display: flex; 
  align-items: center; 
  gap: 10px; 
}


.logo-text {
  font-family: 'Train One', cursive;
  font-size: 30px !important;
  color: #438D7E;
}

.logo-img {
  height: 60px; /* Đặt chiều cao cho logo */
}

  .footer-section h2 {
    font-size: 1.5em;
    margin-bottom: 10px;
  }

  .footer-section p {
    font-size: 1em;
    margin-bottom: 10px;
  }

  .contact span {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }

  .contact a {
    color: #fff;
    text-decoration: none;
    display: flex;
    align-items: center;
  }

  .contact a:hover {
    text-decoration: underline;
  }

  .footer-section ul {
    list-style: none;
    padding: 0;
  }

  .footer-section ul li {
    margin-bottom: 5px;
    display: flex;
    align-items: center;
  }

  .footer-section ul li a {
    color: #fff;
    text-decoration: none;
    display: flex;
    align-items: center;
  }

  .footer-section ul li a:hover {
    text-decoration: underline;
  }

  .footer-bottom {
    text-align: center;
    margin-top: 20px;
    padding-top: 10px;
    border-top: 1px solid #102C57;
  }

  .footer-bottom p {
    font-size: 0.9em;
  }

  
  .contact span svg,
  .footer-section ul li a svg {
    margin-right: 8px;
  }

  @media (max-width: 768px) {
    .section {
      flex-direction: column;
    }

    .card {
      width: 100%;
    }

    .footer-content {
      flex-direction: column;
    }

    .footer-section {
      margin-bottom: 20px;
    }
  }
`;

export default Wrapper;