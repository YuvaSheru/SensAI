'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Download, Plus, Trash, Wand2 } from 'lucide-react';

export default function ResumeBuilder() {
  const [sections, setSections] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: '',
    },
    summary: '',
    experience: [
      {
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        achievements: [''],
      },
    ],
    education: [
      {
        degree: '',
        school: '',
        location: '',
        graduationDate: '',
        gpa: '',
        achievements: [''],
      },
    ],
    skills: {
      technical: [''],
      soft: [''],
    },
    projects: [
      {
        name: '',
        description: '',
        technologies: '',
        link: '',
      },
    ],
  });

  const [activePreview, setActivePreview] = useState(false);

  const handlePersonalInfoChange = (field, value) => {
    setSections(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    setSections(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const addExperience = () => {
    setSections(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          title: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
          achievements: [''],
        },
      ],
    }));
  };

  const removeExperience = (index) => {
    setSections(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const addSkill = (type) => {
    setSections(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: [...prev.skills[type], ''],
      },
    }));
  };

  const handleSkillChange = (type, index, value) => {
    setSections(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: prev.skills[type].map((skill, i) =>
          i === index ? value : skill
        ),
      },
    }));
  };

  const getAISuggestions = async (section, content) => {
    toast.promise(
      new Promise((resolve) => {
        // Simulated AI response - Replace with actual API call
        setTimeout(() => {
          const suggestions = {
            summary: "Experienced software engineer with expertise in...",
            achievements: [
              "Increased system performance by 40% through optimization",
              "Led a team of 5 developers in successful project delivery",
              "Implemented CI/CD pipeline reducing deployment time by 60%"
            ]
          };
          resolve(suggestions[section]);
        }, 1500);
      }),
      {
        loading: 'Getting AI suggestions...',
        success: 'Suggestions ready!',
        error: 'Failed to get suggestions',
      }
    );
  };

  const downloadResume = () => {
    // Implement PDF generation logic here
    toast.success('Resume downloaded successfully!');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">AI Resume Builder</h1>
          <p className="text-muted-foreground">
            Create a professional resume with AI-powered suggestions
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => setActivePreview(!activePreview)}
          >
            {activePreview ? 'Edit Resume' : 'Preview Resume'}
          </Button>
          <Button onClick={downloadResume}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Section */}
        <div className={activePreview ? 'hidden lg:block' : ''}>
          <div className="space-y-6">
            {/* Personal Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Full Name"
                  value={sections.personalInfo.name}
                  onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={sections.personalInfo.email}
                  onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                />
                <Input
                  placeholder="Phone"
                  value={sections.personalInfo.phone}
                  onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                />
                <Input
                  placeholder="Location"
                  value={sections.personalInfo.location}
                  onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                />
                <Input
                  placeholder="LinkedIn URL"
                  value={sections.personalInfo.linkedin}
                  onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                />
                <Input
                  placeholder="Portfolio URL"
                  value={sections.personalInfo.portfolio}
                  onChange={(e) => handlePersonalInfoChange('portfolio', e.target.value)}
                />
              </div>
            </Card>

            {/* Professional Summary */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Professional Summary</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => getAISuggestions('summary')}
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Get AI Suggestions
                </Button>
              </div>
              <Textarea
                placeholder="Write a compelling professional summary..."
                value={sections.summary}
                onChange={(e) => setSections(prev => ({
                  ...prev,
                  summary: e.target.value
                }))}
                className="min-h-[100px]"
              />
            </Card>

            {/* Experience */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Experience</h2>
                <Button onClick={addExperience}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </div>
              {sections.experience.map((exp, index) => (
                <div key={index} className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Experience {index + 1}</h3>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeExperience(index)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Job Title"
                      value={exp.title}
                      onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                    />
                    <Input
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                    />
                    <Input
                      placeholder="Start Date"
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                    />
                    <Input
                      placeholder="End Date"
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                    />
                  </div>
                  <Textarea
                    placeholder="Job Description"
                    value={exp.description}
                    onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                  />
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Key Achievements</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => getAISuggestions('achievements')}
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Enhance with AI
                    </Button>
                  </div>
                </div>
              ))}
            </Card>

            {/* Skills */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Skills</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Technical Skills</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addSkill('technical')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Skill
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {sections.skills.technical.map((skill, index) => (
                      <Input
                        key={index}
                        placeholder="e.g., JavaScript, React, Node.js"
                        value={skill}
                        onChange={(e) => handleSkillChange('technical', index, e.target.value)}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Soft Skills</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addSkill('soft')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Skill
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {sections.skills.soft.map((skill, index) => (
                      <Input
                        key={index}
                        placeholder="e.g., Leadership, Communication"
                        value={skill}
                        onChange={(e) => handleSkillChange('soft', index, e.target.value)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Preview Section */}
        <div className={!activePreview ? 'hidden lg:block' : ''}>
          <Card className="p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Resume Preview</h2>
            <div className="prose max-w-none">
              {/* Personal Info */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold">{sections.personalInfo.name}</h1>
                <p className="text-muted-foreground">
                  {sections.personalInfo.email} • {sections.personalInfo.phone}
                </p>
                <p className="text-muted-foreground">
                  {sections.personalInfo.location}
                </p>
                {sections.personalInfo.linkedin && (
                  <p className="text-muted-foreground">
                    LinkedIn: {sections.personalInfo.linkedin}
                  </p>
                )}
              </div>

              {/* Summary */}
              {sections.summary && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold border-b pb-2 mb-2">
                    Professional Summary
                  </h2>
                  <p>{sections.summary}</p>
                </div>
              )}

              {/* Experience */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold border-b pb-2 mb-2">
                  Experience
                </h2>
                {sections.experience.map((exp, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{exp.title}</h3>
                        <p className="text-muted-foreground">{exp.company}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </p>
                    </div>
                    <p className="mt-2">{exp.description}</p>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold border-b pb-2 mb-2">
                  Skills
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Technical</h3>
                    <ul className="list-disc list-inside">
                      {sections.skills.technical.map((skill, index) => (
                        skill && <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Soft Skills</h3>
                    <ul className="list-disc list-inside">
                      {sections.skills.soft.map((skill, index) => (
                        skill && <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 