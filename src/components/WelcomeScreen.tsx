import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomeScreen = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="welcome-screen">
      <h1>Bem-vindo!</h1>
      <p>Crie sua conta ou faça login para acessar o sistema.</p>
      <button onClick={handleSignUpClick}>Cadastrar</button>
      <button onClick={handleLoginClick}>Entrar</button>
    </div>
  );
};

export default WelcomeScreen;