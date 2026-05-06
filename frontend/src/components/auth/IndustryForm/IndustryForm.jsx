import { useState } from "react";
import TagInput from "../../ui/Fields/TagInput/TagInput";
import CVUploadZone from "../../ui/Fields/CVUploadZone/CVUploadZone";
import { Field } from '../../ui/Fields/Field/Field';

function IndustryForm({ form, onChange, errors }) {
  const [tags, setTags] = useState([]);
  const [cvFileName, setCvFileName] = useState(null);

  return (
    <div className="industry-form">
      <Field
        label="Email Address"
        name="email"
        type="email"
        value={form.email}
        disabled
      />
      <Field
        label="Institution / Organisation"
        name="organisation"
        placeholder="Where do you currently work or teach?"
        value={form.organisation}
        onChange={onChange}
        error={errors.organisation}
      />
      <Field
        label="Job Title"
        name="jobTitle"
        placeholder="e.g. Senior UX Designer"
        value={form.jobTitle}
        onChange={onChange}
        error={errors.jobTitle}
      />
      <TagInput
        tags={tags}
        onChange={setTags}
      />
      <CVUploadZone
        fileName={cvFileName}
        onChange={setCvFileName}
      />
    </div>
  );
}

export default IndustryForm;