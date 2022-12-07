import { useState } from "react";
import MessageBox from "./message-box";

const ContactWidget = () => {
    const [messageBox, setMessageBox] = useState(false);

    return (
        <div className="nuron-expo-filter-widget widget-shortby">
            <div className="inner">
                <h5 className="widget-title">Contact</h5>
                <div className="content">
                    <div className="nuron-form-contact-widget">
                        <i className="feather-mail" />
                        <span className="contact_info" onClick={() => setMessageBox(true)}>Send Message</span>
                    </div>
                    <div className="nuron-form-contact-widget">
                        <i className="feather-user-plus" />
                        <span className="contact_info">Add to Friend</span>
                    </div>
                    <div className="nuron-form-contact-widget">
                        <i className="feather-user-check" />
                        <span className="contact_info">Rank User</span>
                    </div>
                </div>
            </div>
            {
                messageBox && (
                    <MessageBox show={messageBox} onClose={() => setMessageBox(false)} />
                )
            }
        </div>
    )
};

export default ContactWidget;
