/**
 * Email Service for sending transactional emails
 * Supports multiple providers: SendGrid, Firebase Functions, etc.
 */

export interface EmailTemplate {
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export interface EmailConfig {
  provider: 'sendgrid' | 'firebase' | 'console'; // console for development
  apiKey?: string;
  fromEmail: string;
  fromName: string;
}

export class EmailService {
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
  }

  /**
   * Send newsletter verification email
   */
  async sendNewsletterVerification(email: string, token: string): Promise<void> {
    const verificationUrl = `${window.location.origin}/newsletter/verify?token=${token}`;
    
    const template: EmailTemplate = {
      subject: "Confirmez votre abonnement à la newsletter Ma'a yegue",
      htmlContent: this.getNewsletterVerificationTemplate(verificationUrl),
      textContent: `
Bonjour,

Merci de vous être inscrit(e) à notre newsletter !

Pour confirmer votre abonnement, veuillez cliquer sur ce lien :
${verificationUrl}

Si vous n'avez pas demandé cet abonnement, vous pouvez ignorer cet email.

Cordialement,
L'équipe Ma'a yegue
      `.trim()
    };

    await this.sendEmail(email, template);
  }

  /**
   * Send email verification for user registration
   */
  async sendEmailVerification(email: string, verificationUrl: string): Promise<void> {
    const template: EmailTemplate = {
      subject: "Vérifiez votre adresse email - Ma'a yegue",
      htmlContent: this.getEmailVerificationTemplate(verificationUrl),
      textContent: `
Bonjour,

Merci de vous être inscrit(e) sur Ma'a yegue !

Pour vérifier votre adresse email, veuillez cliquer sur ce lien :
${verificationUrl}

Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.

Cordialement,
L'équipe Ma'a yegue
      `.trim()
    };

    await this.sendEmail(email, template);
  }

  /**
   * Send email using configured provider
   */
  private async sendEmail(to: string, template: EmailTemplate): Promise<void> {
    switch (this.config.provider) {
      case 'console':
        // Development mode - log to console
        console.log('📧 Email would be sent:');
        console.log(`To: ${to}`);
        console.log(`From: ${this.config.fromName} <${this.config.fromEmail}>`);
        console.log(`Subject: ${template.subject}`);
        console.log(`Content: ${template.textContent}`);
        break;

      case 'sendgrid':
        await this.sendWithSendGrid(to, template);
        break;

      case 'firebase':
        await this.sendWithFirebase(to, template);
        break;

      default:
        throw new Error(`Unsupported email provider: ${this.config.provider}`);
    }
  }

  /**
   * Send email using SendGrid
   */
  private async sendWithSendGrid(to: string, template: EmailTemplate): Promise<void> {
    if (!this.config.apiKey) {
      throw new Error('SendGrid API key not configured');
    }

    const payload = {
      personalizations: [
        {
          to: [{ email: to }],
          subject: template.subject
        }
      ],
      from: {
        email: this.config.fromEmail,
        name: this.config.fromName
      },
      content: [
        {
          type: 'text/plain',
          value: template.textContent || ''
        },
        {
          type: 'text/html',
          value: template.htmlContent
        }
      ]
    };

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`SendGrid API error: ${response.status}`);
    }
  }

  /**
   * Send email using Firebase Functions
   */
  private async sendWithFirebase(to: string, template: EmailTemplate): Promise<void> {
    // This would use Firebase Functions to send emails
    // Example implementation using httpsCallable
    /*
    import { httpsCallable } from 'firebase/functions';
    import { functions } from '@/core/config/firebase.config';
    
    const sendEmail = httpsCallable(functions, 'sendEmail');
    await sendEmail({
      to,
      subject: template.subject,
      html: template.htmlContent,
      text: template.textContent
    });
    */
    
    console.log('Firebase email sending not implemented yet');
    console.log(`Would send to: ${to}, Subject: ${template.subject}`);
  }

  /**
   * Newsletter verification email template
   */
  private getNewsletterVerificationTemplate(verificationUrl: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmez votre abonnement</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; background: #10b981; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Ma'a yegue</h1>
            <h2>Confirmez votre abonnement</h2>
        </div>
        <div class="content">
            <p>Bonjour,</p>
            <p>Merci de vous être inscrit(e) à notre newsletter !</p>
            <p>Pour confirmer votre abonnement et commencer à recevoir nos contenus exclusifs sur les langues camerounaises, veuillez cliquer sur le bouton ci-dessous :</p>
            <p style="text-align: center;">
                <a href="${verificationUrl}" class="button">Confirmer mon abonnement</a>
            </p>
            <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :</p>
            <p style="word-break: break-all; color: #6b7280;">${verificationUrl}</p>
            <p>Si vous n'avez pas demandé cet abonnement, vous pouvez ignorer cet email en toute sécurité.</p>
            <p>Cordialement,<br>L'équipe Ma'a yegue</p>
        </div>
        <div class="footer">
            <p>© 2025 Ma'a yegue. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  /**
   * Email verification template for user registration
   */
  private getEmailVerificationTemplate(verificationUrl: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vérifiez votre adresse email</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; background: #3b82f6; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Ma'a yegue</h1>
            <h2>Vérifiez votre adresse email</h2>
        </div>
        <div class="content">
            <p>Bonjour,</p>
            <p>Bienvenue sur Ma'a yegue ! Nous sommes ravis de vous compter parmi nous.</p>
            <p>Pour finaliser la création de votre compte et accéder à toutes nos fonctionnalités, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
            <p style="text-align: center;">
                <a href="${verificationUrl}" class="button">Vérifier mon email</a>
            </p>
            <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :</p>
            <p style="word-break: break-all; color: #6b7280;">${verificationUrl}</p>
            <p>Si vous n'avez pas créé de compte sur Ma'a yegue, vous pouvez ignorer cet email en toute sécurité.</p>
            <p>Cordialement,<br>L'équipe Ma'a yegue</p>
        </div>
        <div class="footer">
            <p>© 2025 Ma'a yegue. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>
    `.trim();
  }
}

// Default email service instance
export const emailService = new EmailService({
  provider: import.meta.env.PROD ? 'sendgrid' : 'console',
  apiKey: import.meta.env.VITE_SENDGRID_API_KEY,
  fromEmail: import.meta.env.VITE_FROM_EMAIL || 'noreply@maayegue.com',
  fromName: "Ma'a yegue"
});