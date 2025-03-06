import React from 'react';
import { Box } from '@mui/material';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ value, onChange, language = 'javascript', height = '400px' }) => {
  const handleEditorChange = (value) => {
    onChange(value);
  };

  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </Box>
  );
};

export default CodeEditor;