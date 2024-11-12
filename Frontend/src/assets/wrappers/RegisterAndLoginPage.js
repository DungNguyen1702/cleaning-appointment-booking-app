import styled from 'styled-components';

const Wrapper = styled.section`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr; 
  align-items: center;
  background-color: #FFF8F8; 

  .left-side {
    padding: 2rem;
    background-color: #FFF8F8; 
  }

  .right-side {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #FFF8F8; 
  }

  .form-left {
    display: flow-root;
    max-width: 400px;
    border-top: 5px solid #102C57; 
    width: 90vw;
    background-color: #FFF8F8; 
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-2);
    padding: 2rem 2.5rem;
    margin: 3rem auto;
  }

  h4 {
    text-align: center;
    margin-bottom: 1.38rem;
  }

  p {
    margin-top: 1rem;
    text-align: center;
    line-height: 1.5;
  }

  .btn {
    margin-top: 1rem;
    background-color: #102C57; 
    color: white; 
    border: none;
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    font-size: 1rem;
    border-radius: 5px;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  .btn-block {
    display: block;
    width: 100%;
  }

  .btn:hover {
    background-color: #FFF8F8; 
    color: #102C57; 
    border: 1px solid #102C57; 
  }

  .member-btn {
    color: #1679AB; 
    letter-spacing: var(--letter-spacing);
    margin-left: 0.25rem;
  }

  .login-image {
    width: 100%; 
    height: 100vh; 
    object-fit: cover; 
    border-radius: 5px;
  }

  .remember-forgot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;
  }

  .remember-forgot label {
    display: flex;
    align-items: center;
    font-size: 0.9rem;
  }

  .remember-forgot input[type='checkbox'] {
    margin-right: 0.5rem;
  }

  .forgot-password {
    color: #102C57; 
    font-size: 0.9rem;
    text-decoration: none;
  }

  .forgot-password:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;

    .right-side {
      display: none;
    }

    .form-left {
      max-width: 100%;
      width: 100%;
      padding: 1rem;
    }
  }
`;

export default Wrapper;