const en = {
    // Callback page
    callback_loading_title: "Processing authentication...",
    callback_loading_description: "This may take a few seconds. Please do not close this window.",

    // Client Home Loading
    client_home_loading_title: "Loading your client dashboard...",
    client_home_loading_description: "Please wait a few seconds while we prepare your data.",

    // Client Home
    client_home_welcome: "Welcome, {name}!",
    client_home_create_request_title: "Create new request",
    client_home_form_description_label: "Describe your problem",
    client_home_form_description_placeholder: "Write in detail what's happening...",
    client_home_form_description_error: "* This field is required.",
    client_home_form_price_label: "Offered price (Bs.)",
    client_home_form_price_placeholder: "E.g. 150",
    client_home_form_price_error: "* Invalid price. Enter a value greater than 0.",
    client_home_form_submit_button: "Submit Request",
    client_home_top_techs_title: "Top-rated technicians right now",
    client_home_top_techs_reviews: " reviews",
    client_home_top_techs_empty: "There are no rated technicians yet.",
    client_home_stats_created: "Requests Created:",
    client_home_stats_finalized: "Requests Finalized:",
    client_home_last_chats_title: "Latest Chats",
    client_home_chat_with: "Chat with {name}",
    client_home_no_chats: "No recent chats.",
    client_home_last_requests_title: "Status of recent requests",
    client_home_request_created_on: "Created on",
    client_home_error_no_client: "No authenticated client found.",
    client_home_request_sent: "Request sent successfully.",
    client_home_error_request_sent: "Error sending request. Please try again.",

    // Client Requests Loading
    client_requests_loading_message: "Loading client requests...",

    // Client Requests
    client_requests_title: "Request Management",
    client_requests_new_button: "New Request",
    client_requests_section_created: "Created Requests",
    client_requests_section_offers: "Incoming Offers",
    client_requests_section_progress: "Request Progress",
    client_requests_section_closed: "Closed Requests",

    // Settings Loading
    settings_loading_title: "Loading settings...",
    settings_loading_description: "Please wait while we prepare your profile and preferences.",

    // Settings
    settings_title: "Profile Settings",
    settings_personal_info_title: "Personal Information",
    settings_field_name: "First Name",
    settings_field_last_name: "Last Name",
    settings_field_required: "* This field cannot be empty",
    settings_professional_info_title: "Professional Information",
    settings_field_experience: "Experience",
    settings_field_experience_empty: "No experience registered",
    settings_field_years_experience: "Years of experience",
    settings_field_years_label: "years",
    settings_preferences_title: "Preferences",
    settings_dark_mode: "Dark theme",
    settings_dark_mode_on: "Enabled",
    settings_dark_mode_off: "Disabled",
    settings_language: "Language",
    settings_language_placeholder: "Select language",
    settings_save_button: "Save changes",
    settings_save_success: "Changes saved successfully",
    settings_save_error: "Failed to save changes. Please try again.",
    settings_validation_error: "Fields cannot be empty.",
    settings_language_es: "Spanish",
    settings_language_en: "English",

    // Technician Home Loading
    technician_requests_title: "Request Management",
    technician_requests_new: "New Requests",
    technician_requests_sent: "Sent Offers",
    technician_requests_progress: "Request Progress",
    technician_requests_closed: "Closed Requests",

    // Welcome
    welcome_steps_technician_title: "Are you a Technician? Follow these steps:",
    welcome_steps_user_title: "Are you a User? Here's how it works:",

    welcome_tech_1_title: "Receive requests",
    welcome_tech_1_desc: "Access new job opportunities by reviewing service requests posted by users.",
    welcome_tech_2_title: "Send proposals",
    welcome_tech_2_desc: "Respond with your price, message, and availability to assist the client.",
    welcome_tech_3_title: "Close the deal and solve it",
    welcome_tech_3_desc: "Once the client accepts your proposal, open the chat, coordinate, and solve the issue.",
    welcome_tech_4_title: "Manage your work",
    welcome_tech_4_desc: "From your dashboard you can view tickets, pending requests, and service history.",
    welcome_tech_5_title: "Receive ratings",
    welcome_tech_5_desc: "Clients can rate your work and leave visible comments for future users.",
    welcome_tech_6_title: "Improve your profile",
    welcome_tech_6_desc: "Update your experience, skills, and information to stand out to new clients.",

    welcome_user_1_title: "Post your issue",
    welcome_user_1_desc: "Describe what's happening with your device. You can add photos or relevant details.",
    welcome_user_2_title: "Receive proposals",
    welcome_user_2_desc: "Technicians will send you proposals with price, message, and conditions.",
    welcome_user_3_title: "Choose and resolve",
    welcome_user_3_desc: "Accept a proposal, open the chat, coordinate with the technician, and solve your issue.",
    welcome_user_4_title: "Track your ticket",
    welcome_user_4_desc: "Each request generates a ticket where all messages and actions are stored.",
    welcome_user_5_title: "Rate the service",
    welcome_user_5_desc: "After the job, you can rate the technician and leave a visible comment.",
    welcome_user_6_title: "Trust assured",
    welcome_user_6_desc: "All technicians are verified. Check their profile, experience, and reviews before hiring.",

    // Auth Guard
    auth_guard_verifying: "Verifying authentication...",
    auth_guard_description: "Please wait a few seconds while we prepare your data.",

    // Client Chat Loading
    client_chat_title: "Active Chats",
    client_chat_search_placeholder: "Search technician...",
    client_chat_no_messages: "No messages",
    client_chat_last_message_label: "Last message:",
    client_chat_button_review: "Rate",
    client_chat_delete_title: "Delete chat?",
    client_chat_delete_description: "This action cannot be undone. The chat will be permanently removed from the system.",
    client_chat_delete_cancel: "Cancel",
    client_chat_delete_confirm: "Delete",
    client_chat_deleted_success: "Chat deleted successfully.",
    client_chat_deleted_error: "Failed to delete the chat. Please try again.",
    client_chat_empty: "No chats found.",
    client_chat_with: "Chat with",
    client_chat_finalize_button: "Finish",
    client_chat_finalize_title: "Do you want to end this chat?",
    client_chat_finalize_description: "This action is irreversible. You will no longer be able to send messages.",
    client_chat_cancel: "Cancel",
    client_chat_input_placeholder: "Type a message...",

    // Client Offer Dialog
    client_offer_title: "Technician Offer",
    client_offer_subtitle: "Review the request and select an action",
    client_offer_request: "Request:",
    client_offer_message: "Technician's message:",
    client_offer_price: "Proposed price:",
    client_offer_no_message: "No message",
    client_offer_accept: "Accept Offer",
    client_offer_reject: "Reject Offer",
    client_offer_view_profile: "View Technician Profile",
    client_offer_accept_success: "Offer accepted.",
    client_offer_accept_error: "Error accepting the offer.",
    client_offer_reject_success: "Offer rejected.",
    client_offer_reject_error: "Error rejecting the offer.",
    client_offer_no_technician: "Technician not found.",

    // Registration
    register_title_client: "Client Registration",
    register_title_technician: "Technician Registration",
    register_subtitle: "Complete the fields to continue with Aurora Connect.",
    register_tab_client: "Client",
    register_tab_technician: "Technician",
    register_input_name: "First Name",
    register_input_lastname: "Last Name",
    register_input_experience: "Experience",
    register_input_years: "Years of experience",
    register_required: "Required",
    register_cancel: "Cancel",
    register_submit: "Register",

    // Request View
    request_view_title: "Request Details",
    request_view_client: "Client:",
    request_view_description: "Description:",
    request_view_price: "Offered Price:",
    request_view_status: "Status:",
    request_view_created: "Created:",
    request_view_updated: "Last Updated:",

    // Footer
    footer_brand: "AURORA CONNECT",
    footer_rights_reserved: "All rights reserved – Aurora Connect 2025",

    // Navbar
    navbar_brand: "AURORA CONNECT",
    navbar_login: "Log In",
    navbar_register: "Sign Up",

    // Navbar User
    navbar_user_notifications: "Notifications",
    navbar_user_default_name: "User",
    notifications_mark_all: "Mark all as read",
    notifications_empty: "No notifications",
    notifications_clear_read: "Clear",

    // Sidebar
    sidebar_app_name: "Aurora Connect",
    sidebar_role_client: "Client",
    sidebar_group_panel: "Dashboard",
    sidebar_home: "Home",
    sidebar_requests_client: "My Requests",
    sidebar_ratings_technician: "My Ratings",
    sidebar_group_settings: "Settings",
    sidebar_settings: "Settings",
    sidebar_support: "Support",
    sidebar_footer: "© Aurora Connect 2025",

    // User Menu
    user_menu_logout: "Log Out",

    // Review Dialog
    review_title: "Rate the Technician",
    review_comment_placeholder: "Write a comment (optional)...",
    review_submit: "Submit Rating",
    review_error_fields: "Please complete all required fields.",
    review_success: "Rating submitted successfully.",
    review_error: "An error occurred while submitting the rating.",

    // Requests Section
    requests_sort_by: "Sort by",
    requests_sort_date_asc: "Date ↑",
    requests_sort_date_desc: "Date ↓",
    requests_sort_price_asc: "Price ↑",
    requests_sort_price_desc: "Price ↓",
    requests_sort_az: "A-Z",
    requests_sort_za: "Z-A",
    requests_status: "Status",
    requests_status_all: "All",
    requests_search_placeholder: "Search...",
    requests_tooltip: "You can use the search field to filter\nrequests by description or the filter field\nto sort the requests.",
    requests_price_prefix: "Price: Bs.",
    requests_created_prefix: "Created:",
    requests_review_button: "Review",
    requests_no_results: "No results found.",
    requests_pagination: "Page {page} of {totalPages}",
    requests_prev: "Previous",
    requests_next: "Next",

    // Request Dialog
    request_dialog_title: "New Request",
    request_dialog_description: "Review the request and choose an action",
    request_dialog_client: "Client:",
    request_dialog_description_label: "Description:",
    request_dialog_price_label: "Offered price:",
    request_dialog_accept: "Accept Request",
    request_dialog_reject: "Reject Request",
    request_dialog_counter_offer_btn: "Make counteroffer",
    request_dialog_offer_reason: "Reason for your counteroffer",
    request_dialog_offer_price: "New price (Bs.)",
    request_dialog_send_offer: "Send counteroffer",
    request_dialog_invalid_price: "Please enter a valid price.",
    request_dialog_reason_required: "Please describe the reason for your counteroffer.",
    request_dialog_accepted: "Request accepted.",
    request_dialog_rejected: "Request rejected.",
    request_dialog_offer_sent: "Counteroffer sent.",
    request_dialog_accept_error: "Error accepting the request.",
    request_dialog_reject_error: "Error rejecting the request.",
    request_dialog_offer_error: "Error sending the counteroffer.",

    // Technician Profile
    technician_profile_title: "Technician Profile",
    technician_profile_description: "General Information",
    technician_profile_registered: "Registered technician",
    technician_profile_experience: "Experience",
    technician_profile_experience_none: "Not provided.",
    technician_profile_years: "Years of Experience",
    technician_profile_years_none: "Not specified",
    technician_profile_reviews: "Reviews",
    technician_profile_no_comment: "No comment",
    technician_profile_no_reviews: "No reviews yet.",

    // Technician Ratings
    technician_ratings_title: "My Ratings",
    technician_ratings_description: "Reviews received from clients",
    technician_ratings_no_comment: "No comment",
    technician_ratings_no_reviews: "You don't have any reviews yet.",

    // Hero Section
    hero_real_solutions: "Real solutions",
    hero_connecting_people: "We connect those in need of support with those who know how to solve it.",

    // How It Works Section
    howitworks_title: "Real tech problems, instant solutions.",
    howitworks_paragraph: "We connect people facing issues or doubts with their digital devices to verified technicians ready to help. We simplify tech assistance with speed, trust, and direct communication.",
    howitworks_register_technician: "Register as Technician",
    howitworks_register_client: "Register as Client",

    // Carousel
    carousel_user_title: "User Steps",
    carousel_technician_title: "Technician Steps",
    carousel_user_step1_title: "Create account",
    carousel_user_step1_desc: "Register on Aurora Connect as a client.",
    carousel_user_step2_title: "Post request",
    carousel_user_step2_desc: "Describe your computer issue and post the request.",
    carousel_user_step3_title: "Choose technician",
    carousel_user_step3_desc: "Review technician proposals and accept the one you prefer.",

    // Request Status
    status_disabled: "Disabled",
    status_enabled: "Enabled",
    status_pending: "Pending",
    status_rejected_by_technician: "Rejected by Technician",
    status_counter_offer_by_technician: "Counteroffer by Technician",
    status_accepted_by_technician: "Accepted by Technician",
    status_rejected_by_client: "Rejected by Client",
    status_accepted_by_client: "Accepted by Client",
    status_chat_active: "Chat Active",
    status_finished: "Completed",
    status_rated: "Rated",
    status_deleted: "Deleted",
};

export default en;
