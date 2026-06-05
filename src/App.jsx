import { useState } from 'react';
import DynamicForm from './DynamicForm.jsx';
import { signupFormConfig } from './formConfig.js';

export default function App() {
  const [submitted, setSubmitted] = useState(null);

  return (
    <div className="container py-5" style={{ maxWidth: 640 }}>
      <div className="card shadow-sm"> bjbjbjbjbj
        <div className="card-body">
          <h1 className="h4 mb-4">Sign Up</h1>
          <DynamicForm
            fields={signupFormConfig}
            submitLabel="Create account"
            onSubmit={(values) => setSubmitted(values)}
          />
        </div>
      </div>

      {submitted && (
        <div className="alert alert-success mt-4" role="alert">
          <strong>Submitted values:</strong>
          <pre className="mb-0 mt-2">{JSON.stringify(submitted, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
