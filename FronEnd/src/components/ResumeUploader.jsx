import React, { useState } from 'react';
import './ResumeUploader.css';

const ResumeUploader = ({ onSubmit, isLoading }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!(file.type === 'application/pdf' || file.type === 'text/plain')) {
      setError('Please upload a PDF or text file');
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
    setError('');

    // Read the file contents
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      setIsUploading(true);
      try {
        if (file.type === 'application/pdf') {
          // For PDFs, we'd need a PDF parsing library in production
          // For simplicity in this demo, we'll just store the raw data
          setResumeText(`PDF content from: ${file.name}`);
        } else {
          // For text files, we can directly read the content
          setResumeText(event.target.result);
        }
      } catch (err) {
        console.error('Error reading file:', err);
        setError('Failed to read file content');
      } finally {
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      setError('Failed to read file');
      setIsUploading(false);
    };

    if (file.type === 'text/plain') {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!resumeFile) {
      setError('Please upload your resume');
      return;
    }
    
    if (!jobTitle.trim()) {
      setError('Please enter the job title');
      return;
    }
    
    if (!companyName.trim()) {
      setError('Please enter the company name');
      return;
    }

    onSubmit({
      resumeText,
      jobTitle,
      companyName,
      fileName: resumeFile.name
    });
  };

  return (
    <div className="resume-uploader">
      <div className="uploader-container">
        <h2>Prepare for Your Interview</h2>
        <p className="description">
          Upload your resume and provide details about the position you're applying for.
          We'll generate tailored interview questions to help you practice.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="file-upload-area">
            <input
              type="file"
              id="resume-upload"
              accept=".pdf,.txt"
              onChange={handleFileChange}
              className="file-input"
            />
            <label htmlFor="resume-upload" className="file-label">
              {resumeFile ? resumeFile.name : 'Choose Resume File (PDF or TXT)'}
            </label>
            <p className="file-help">Drag and drop your resume or click to browse</p>
          </div>

          <div className="form-group">
            <label htmlFor="job-title">Job Title</label>
            <input
              type="text"
              id="job-title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Frontend Developer"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="company-name">Company Name</label>
            <input
              type="text"
              id="company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Tech Solutions Inc."
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading || isUploading}
          >
            {isLoading ? 'Generating Questions...' : 'Prepare Interview Questions'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResumeUploader; 