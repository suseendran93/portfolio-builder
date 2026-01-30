import React, { createContext, useState } from 'react';
import infoData from '../data/info.json';

export const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [portfolioData, setPortfolioData] = useState({
    about: infoData.about || "",
    name: "Suseendran Kumar",
    title: "Frontend Developer",
    profilePic: null,
    work: [
      {
        company: "Hexaware Technologies Ltd.",
        role: "Software Engineer",
        date: "2015-2018",
        description: infoData.work[0]
      },
      {
        company: "Cognizant Technologies Solutions",
        role: "Associate Engineer",
        date: "2018-2021",
        description: infoData.work[1]
      },
      {
        company: "Acube Technologies",
        role: "Technical Lead",
        date: "2021-2022",
        description: infoData.work[2]
      }
    ],
    education: [
      {
        degree: "Higher Secondary",
        school: "New Prince Matric. Hr. Sec. School",
        date: "2010-2011",
        description: infoData.education[0]
      },
      {
        degree: "Under graduate",
        school: "Sri Sairam Engineering College",
        date: "2011-2015",
        description: infoData.education[1]
      },
      {
        degree: "Post Graduate",
        school: "Dublin Business School",
        date: "2022-2023",
        description: infoData.education[2]
      }
    ],
    skills: [
      { name: "JavaScript", percent: 85 },
      { name: "CSS", percent: 95 },
      { name: "HTML", percent: 95 },
      { name: "React", percent: 90 },
      { name: "Github", percent: 70 },
      { name: "Node.js", percent: 70 },
      { name: "Bootstrap", percent: 90 },
      { name: "MongoDB", percent: 60 },
      { name: "VS Code", percent: 90 }
    ],
    contact: {
      phone: "(+91)9551459935",
      email: "suzeendran@gmail.com",
      github: "https://github.com/suseendran93",
      linkedin: "https://www.linkedin.com/in/suseendran-k-02101993/"
    }
  });

  const [user, setUser] = useState(null); // { name: "User" } when logged in

  const updatePortfolioData = (section, data) => {
    setPortfolioData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const login = (username) => {
    setUser({ name: username });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <PortfolioContext.Provider value={{ portfolioData, updatePortfolioData, user, login, logout }}>
      {children}
    </PortfolioContext.Provider>
  );
};
