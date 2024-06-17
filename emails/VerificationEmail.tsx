import * as React from "react";

interface EmailTemplateProps {
  username: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  username: string,
}) => (
  <div>
    <h1>Welcome, {username}!</h1>
  </div>
);
