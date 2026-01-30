import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Tabs, Tab, Card, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PortfolioContext } from '../../context/PortfolioContext';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';

const Builder = () => {
    const { portfolioData, updatePortfolioData } = useContext(PortfolioContext);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('about');
    const [showModal, setShowModal] = useState(false);
    const [generatedUrl, setGeneratedUrl] = useState('');
    const [generating, setGenerating] = useState(false);

    // Local state for form data to allow changes without immediate commit (Save feature)
    const [localData, setLocalData] = useState({
        name: "",
        title: "",
        profilePic: null,
        about: "",
        education: [],
        work: [],
        skills: [],
        contact: { phone: "", email: "", linkedin: "", github: "" }
    });

    const [hasChanges, setHasChanges] = useState({}); // Tracking changes per section

    // Initialize local state from context
    useEffect(() => {
        if (portfolioData) {
            setLocalData({
                name: portfolioData.name || "",
                title: portfolioData.title || "",
                profilePic: portfolioData.profilePic || null,
                about: portfolioData.about || "",

                education: portfolioData.education || [],
                work: portfolioData.work || [],
                skills: portfolioData.skills || [],
                contact: portfolioData.contact || { phone: "", email: "", linkedin: "", github: "" }
            });
        }
    }, [portfolioData]); // Re-sync if context changes externally or on load

    const handleLogout = async () => {
        console.log("Handle Logout Clicked");
        try {
            await logout();
            console.log("Firebase Logout Successful");
            navigate('/');
        } catch (error) {
            console.error("Logout Error:", error);
            alert('Failed to log out: ' + error.message);
        }
    };

    const handlePreview = () => {
        navigate('/preview');
    };

    const handleGeneratePortfolio = async () => {
        if (!currentUser) {
            alert("Please log in to generate your portfolio.");
            return;
        }

        setGenerating(true);
        console.log("Starting generation...");

        try {
            // 1. Create a cleanup copy of data
            const cleanData = JSON.parse(JSON.stringify(portfolioData));

            // 2. Check or Generate Slug
            let urlSlug = cleanData.customSlug;
            if (!urlSlug) {
                // Generate slug: name-lowercase-random4
                const namePart = (cleanData.name || "user").toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                const randomPart = Math.floor(1000 + Math.random() * 9000); // 4 digit random
                urlSlug = `${namePart}-${randomPart}`;

                cleanData.customSlug = urlSlug;
                // Update context properly so it persists locally too
                updatePortfolioData('customSlug', urlSlug);
                console.log("Generated new slug:", urlSlug);
            }

            // 3. Save to Firestore
            await setDoc(doc(db, "portfolios", currentUser.uid), cleanData);

            // 4. Show URL with Slug
            const url = `${window.location.origin}/#/p/${urlSlug}`;
            setGeneratedUrl(url);
            setShowModal(true);
        } catch (error) {
            console.error("Error generating portfolio:", error);
            alert("Failed to generate portfolio: " + error.message);
        } finally {
            setGenerating(false);
        }
    };

    const handleSave = (section) => {
        updatePortfolioData(section, localData[section]);
        setHasChanges(prev => ({ ...prev, [section]: false }));
        alert(`${section.charAt(0).toUpperCase() + section.slice(1)} Saved!`);
    };

    const handleLocalChange = (section, newData) => {
        setLocalData(prev => ({ ...prev, [section]: newData }));
        setHasChanges(prev => ({ ...prev, [section]: true }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleLocalChange('profilePic', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };


    return (
        <Container fluid className="p-4" style={{ minHeight: "100vh", background: "var(--bg-primary-light)", color: "var(--text-primary-light)" }}>
            <div className="d-flex justify-content-between align-items-center mb-4 p-3 rounded" style={{ background: "var(--bg-card-light)", boxShadow: "0 4px 24px var(--shadow-light)", backdropFilter: "blur(15px)" }}>
                <h1 className="m-0" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Portfolio Builder</h1>
                <div className="d-flex align-items-center">
                    <span className="me-3">Welcome, {currentUser ? currentUser.email : 'User'}</span>
                    <Button variant="success" className="me-2" onClick={handleGeneratePortfolio} disabled={generating}>
                        {generating ? 'Generating...' : 'Generate Portfolio'}
                    </Button>
                    <Button variant="primary" className="me-2" onClick={handlePreview}>View Portfolio</Button>
                    <Button variant="outline-secondary" onClick={handleLogout}>Logout</Button>
                </div>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Portfolio Generated!</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <p>Your portfolio is live at:</p>
                    <div className="p-2 bg-light border rounded mb-3 text-break">
                        <a href={generatedUrl} target="_blank" rel="noopener noreferrer">{generatedUrl}</a>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={() => {
                        navigator.clipboard.writeText(generatedUrl);
                        alert("Link copied!");
                    }}>Copy Link</Button>
                </Modal.Footer>
            </Modal>

            <Card className="shadow-sm border-0" style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(10px)" }}>
                <Card.Body>
                    <Tabs
                        id="builder-tabs"
                        activeKey={activeTab}
                        onSelect={(k) => setActiveTab(k)}
                        className="mb-3"
                    >
                        <Tab eventKey="about" title="Profile">
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={localData.name}
                                    onChange={(e) => handleLocalChange('name', e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Job Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={localData.title}
                                    onChange={(e) => handleLocalChange('title', e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Profile Picture</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                {localData.profilePic && (
                                    <div className="mt-2">
                                        <img src={localData.profilePic} alt="Profile Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }} />
                                    </div>
                                )}
                            </Form.Group>
                            <hr />
                            <Form.Group className="mb-3">
                                <Form.Label>About Me / Bio</Form.Label>

                                <Form.Control
                                    as="textarea"
                                    rows={6}
                                    value={localData.about}
                                    onChange={(e) => handleLocalChange('about', e.target.value)}
                                />
                            </Form.Group>
                            <Button
                                variant={hasChanges.name || hasChanges.title || hasChanges.profilePic || hasChanges.about ? "success" : "primary"}
                                onClick={() => {
                                    handleSave('name');
                                    handleSave('title');
                                    handleSave('profilePic');
                                    handleSave('about');
                                }}
                            >
                                {hasChanges.name || hasChanges.title || hasChanges.profilePic || hasChanges.about ? "Save Changes" : "Save"}
                            </Button>
                        </Tab>

                        <Tab eventKey="education" title="Education">
                            {localData.education.map((edu, index) => (
                                <Card key={index} className="mb-3">
                                    <Card.Body>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>Degree</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={edu.degree || ''}
                                                        onChange={(e) => {
                                                            const newEdu = [...localData.education];
                                                            newEdu[index] = { ...newEdu[index], degree: e.target.value };
                                                            handleLocalChange('education', newEdu);
                                                        }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>School/University</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={edu.school || ''}
                                                        onChange={(e) => {
                                                            const newEdu = [...localData.education];
                                                            newEdu[index] = { ...newEdu[index], school: e.target.value };
                                                            handleLocalChange('education', newEdu);
                                                        }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>Date</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={edu.date || ''}
                                                        onChange={(e) => {
                                                            const newEdu = [...localData.education];
                                                            newEdu[index] = { ...newEdu[index], date: e.target.value };
                                                            handleLocalChange('education', newEdu);
                                                        }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={12}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>Description</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={2}
                                                        value={edu.description || ''}
                                                        onChange={(e) => {
                                                            const newEdu = [...localData.education];
                                                            newEdu[index] = { ...newEdu[index], description: e.target.value };
                                                            handleLocalChange('education', newEdu);
                                                        }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Button varient="outline-danger" size="sm" className="mt-2 text-danger border-danger bg-transparent" onClick={() => {
                                            const newEdu = localData.education.filter((_, i) => i !== index);
                                            handleLocalChange('education', newEdu);
                                        }}>Remove</Button>
                                    </Card.Body>
                                </Card>
                            ))}
                            <Button className="me-2" variant="outline-primary" onClick={() => {
                                const newEdu = [...localData.education, { degree: "", school: "", date: "", description: "" }];
                                handleLocalChange('education', newEdu);
                            }}>Add Education</Button>

                            <Button
                                variant={hasChanges.education ? "success" : "primary"}
                                onClick={() => handleSave('education')}
                            >
                                {hasChanges.education ? "Save Changes" : "Save"}
                            </Button>
                        </Tab>

                        <Tab eventKey="work" title="Work">
                            {localData.work.map((wk, index) => (
                                <Card key={index} className="mb-3">
                                    <Card.Body>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>Company</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={wk.company || ''}
                                                        onChange={(e) => {
                                                            const newWork = [...localData.work];
                                                            newWork[index] = { ...newWork[index], company: e.target.value };
                                                            handleLocalChange('work', newWork);
                                                        }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>Role</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={wk.role || ''}
                                                        onChange={(e) => {
                                                            const newWork = [...localData.work];
                                                            newWork[index] = { ...newWork[index], role: e.target.value };
                                                            handleLocalChange('work', newWork);
                                                        }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>Date</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={wk.date || ''}
                                                        onChange={(e) => {
                                                            const newWork = [...localData.work];
                                                            newWork[index] = { ...newWork[index], date: e.target.value };
                                                            handleLocalChange('work', newWork);
                                                        }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={12}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>Description</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={2}
                                                        value={wk.description || ''}
                                                        onChange={(e) => {
                                                            const newWork = [...localData.work];
                                                            newWork[index] = { ...newWork[index], description: e.target.value };
                                                            handleLocalChange('work', newWork);
                                                        }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Button varient="outline-danger" size="sm" className="mt-2 text-danger border-danger bg-transparent" onClick={() => {
                                            const newWork = localData.work.filter((_, i) => i !== index);
                                            handleLocalChange('work', newWork);
                                        }}>Remove</Button>
                                    </Card.Body>
                                </Card>
                            ))}
                            <Button className="me-2" variant="outline-primary" onClick={() => {
                                const newWork = [...localData.work, { company: "", role: "", date: "", description: "" }];
                                handleLocalChange('work', newWork);
                            }}>Add Work Experience</Button>

                            <Button
                                variant={hasChanges.work ? "success" : "primary"}
                                onClick={() => handleSave('work')}
                            >
                                {hasChanges.work ? "Save Changes" : "Save"}
                            </Button>
                        </Tab>

                        <Tab eventKey="skills" title="Skills">
                            <Row>
                                {localData.skills.map((skill, index) => (
                                    <Col md={4} key={index}>
                                        <Card className="mb-2">
                                            <Card.Body>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>Skill Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={skill.name || ''}
                                                        onChange={(e) => {
                                                            const newSkills = [...localData.skills];
                                                            newSkills[index] = { ...newSkills[index], name: e.target.value };
                                                            handleLocalChange('skills', newSkills);
                                                        }}
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>Percentage</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        value={skill.percent || 0}
                                                        onChange={(e) => {
                                                            const newSkills = [...localData.skills];
                                                            newSkills[index] = { ...newSkills[index], percent: e.target.value };
                                                            handleLocalChange('skills', newSkills);
                                                        }}
                                                    />
                                                </Form.Group>
                                                <Button size="sm" variant="outline-danger" className="p-1 px-2" onClick={() => {
                                                    const newSkills = localData.skills.filter((_, i) => i !== index);
                                                    handleLocalChange('skills', newSkills);
                                                }}>x</Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                            <Button className="mt-2 me-2" variant="outline-primary" onClick={() => {
                                const newSkills = [...localData.skills, { name: "New Skill", percent: 50 }];
                                handleLocalChange('skills', newSkills);
                            }}>Add Skill</Button>

                            <Button
                                className="mt-2"
                                variant={hasChanges.skills ? "success" : "primary"}
                                onClick={() => handleSave('skills')}
                            >
                                {hasChanges.skills ? "Save Changes" : "Save"}
                            </Button>
                        </Tab>

                        <Tab eventKey="contact" title="Contact">
                            <Form.Group className="mb-3">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={localData.contact.phone || ''}
                                    onChange={(e) => handleLocalChange('contact', { ...localData.contact, phone: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={localData.contact.email || ''}
                                    onChange={(e) => handleLocalChange('contact', { ...localData.contact, email: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>LinkedIn URL</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={localData.contact.linkedin || ''}
                                    onChange={(e) => handleLocalChange('contact', { ...localData.contact, linkedin: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>GitHub URL</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={localData.contact.github || ''}
                                    onChange={(e) => handleLocalChange('contact', { ...localData.contact, github: e.target.value })}
                                />
                            </Form.Group>
                            <Button
                                variant={hasChanges.contact ? "success" : "primary"}
                                onClick={() => handleSave('contact')}
                            >
                                {hasChanges.contact ? "Save Changes" : "Save"}
                            </Button>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Builder;
