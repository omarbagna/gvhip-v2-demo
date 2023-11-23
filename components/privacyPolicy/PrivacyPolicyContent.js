import { format } from 'date-fns';
import React from 'react';

const PrivacyPolicyContent = () => {
	return (
		<>
			<div className="privacy-policy-area ptb-100">
				<div className="container">
					<div className="privacy-policy-content">
						<h4>Thank you for visiting GVHIP</h4>
						<p>
							We are committed to protecting your privacy and ensuring the
							security of your personal information. This Privacy Policy
							outlines how we collect, use, disclose, and safeguard your
							information. By accessing or using our website, you consent to the
							practices described in this policy.
						</p>

						<h4>Information We Collect</h4>

						<p>
							We may collect various types of information when you visit our
							website or use our services:
						</p>
						<p>
							<strong>1.</strong> Personal Information: This includes your name,
							contact information, date of birth, and other relevant details
							necessary for insurance processing.
							<br />
							<strong>2.</strong> Payment Information: When you make payments
							for insurance purchases, we collect payment details such as credit
							card information and billing address.
							<br />
							<strong>3.</strong> Travel Details: We collect information about
							your travel plans, destinations, and trip dates to provide
							appropriate insurance options.
							<br />
							<strong>4.</strong> Communication: If you contact us via email,
							phone, or other means, we may retain the communication for
							record-keeping and customer service purposes.
							<br />
							<strong>5.</strong> Usage Information: We collect data on how you
							interact with our website, including pages visited, IP address,
							browser type, and device information.
						</p>
						<h4>How We Use Your Information</h4>

						<p>We use the collected information for the following purposes:</p>
						<p>
							<strong>1.</strong> Providing Services: To process insurance
							purchases, claims, and other related services.
							<br />
							<strong>2.</strong> Communication: To respond to inquiries,
							provide support, and send transactional notifications.
							<br />
							<strong>3.</strong> Improving User Experience: To analyze website
							usage patterns and enhance our websites functionality and user
							interface.
							<br />
							<strong>4.</strong> Marketing: With your consent, we may use your
							contact information to send promotional offers and updates about
							our services.
							<br />
							<strong>5.</strong> Legal Obligations: To comply with legal
							requirements, enforce our terms and conditions, and protect our
							rights and interests.
						</p>
						<h4>How We Share Your Information</h4>

						<p>We may share your information in the following circumstances:</p>
						<p>
							<strong>1.</strong> Service Providers: We may share information
							with third-party service providers who assist us in delivering our
							services, such as payment processors and customer support
							platforms.
							<br />
							<strong>2.</strong> Legal Compliance: We may share information to
							comply with applicable laws, regulations, legal processes, or
							governmental requests.
							<br />
							<strong>3.</strong> Business Transfers: In the event of a merger,
							acquisition, or sale of all or a portion of our assets, your
							information may be transferred as part of the transaction.
							<br />
							<strong>4.</strong> Consent: With your explicit consent, we may
							share information for specific purposes not covered in this
							policy.
						</p>
						<h4>Your Choices</h4>

						<p>
							<strong>1.</strong> Opt-Out: You can opt out of receiving
							marketing communications by following the unsubscribe instructions
							in the emails or by contacting us.
							<br />
							<strong>2.</strong> Access and Correction: You can request access
							to your personal information or request corrections by contacting
							our customer support.
							<br />
							<strong>3.</strong> Cookies and Tracking: You can adjust your
							browser settings to manage cookies and tracking technologies.
						</p>
						<h4>Data Security</h4>

						<p>
							We employ security measures to protect your information from
							unauthorized access, disclosure, alteration, or destruction.
							However, no method of transmission over the internet or electronic
							storage is entirely secure.
						</p>
						<h4>Childrens Privacy</h4>

						<p>
							Our website is not directed at individuals under the age of 18. We
							do not knowingly collect personal information from children.
						</p>
						<h4>Updates to Privacy Policy</h4>

						<p>
							We may update this Privacy Policy from time to time. The{' '}
							<strong>Last Updated</strong> date at the end of the policy
							indicates the latest revision.
						</p>
						<h4>Contact Us</h4>

						<p>
							If you have questions, concerns, or requests related to your
							privacy or this policy, please contact us. By using our website
							and services, you agree to the terms outlined in this Privacy
							Policy.
						</p>
						<p>
							By using our website and services, you agree to the terms outlined
							in this Privacy Policy.
						</p>
						<p>
							Last Updated: {format(new Date('2023-08-09'), 'MMMM dd, yyyy')}
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default PrivacyPolicyContent;
