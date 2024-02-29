import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUpScreen = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      // Exiba mensagem de erro: senhas não coincidem
      return;
    }

    try {
      const response = await axios.post('/api/signup', formData);
      console.log(response.data); // Exemplo de tratamento da resposta

      if (response.success) {
        navigate('/'); // Redirecionar para a página principal
      } else {
        // Exiba mensagens de erro de acordo com a resposta do backend
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      // Exiba mensagens de erro genéricas
    }
  };

  return (
    <div className="signup-screen">
      <h2>Cadastro</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="firstName" placeholder="Nome" onChange={handleChange} />
        <input type="text" name="lastName" placeholder="Sobrenome" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Senha" onChange={handleChange} />
        <input type="password" name="confirmPassword" placeholder="Confirmar Senha" onChange={handleChange} />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default SignUpScreen;