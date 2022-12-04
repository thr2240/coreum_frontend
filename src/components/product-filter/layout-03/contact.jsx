const ContactWidget = () => (
    <div className="nuron-expo-filter-widget widget-shortby">
        <div className="inner">
            <h5 className="widget-title">Contact</h5>
            <div className="content">
                <div className="nuron-form-contact-widget">
                    <i className="feather-mail" />
                    <span>Send Message</span>
                </div>
                <div className="nuron-form-contact-widget">
                    <i className="feather-user-plus" />
                    <span>Add to Friend</span>
                </div>
                <div className="nuron-form-contact-widget">
                    <i className="feather-user-check" />
                    <span>Rank User</span>
                </div>
            </div>
        </div>
    </div>
);

export default ContactWidget;
