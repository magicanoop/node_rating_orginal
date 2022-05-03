const config = require('config');
const mongoose = require('mongoose')

module.exports = function () {
    return [
        {
            _id: mongoose.Types.ObjectId('00categories'),
            order: 1,
            isVisible: true,
            label: "Categories",
            icon: `${config.client_url}/appMenuIcons/categories.png`,
            page: "Categories",
            section: "section_1",
            isPublic: true
        },
        {
            _id: mongoose.Types.ObjectId('notification'),
            order: 2,
            isVisible: true,
            label: "Notifications",
            icon: `${config.client_url}/appMenuIcons/notifications.png`,
            page: "Notifications",
            section: "section_1"
        },
        {
            _id: mongoose.Types.ObjectId('0freeCourses'),
            order: 3,
            isVisible: true,
            label: "Free Courses",
            icon: `${config.client_url}/appMenuIcons/free_courses.png`,
            page: "Free_Courses",
            section: "section_1"
        },
        {
            _id: mongoose.Types.ObjectId('premiumCours'),
            order: 4,
            isVisible: true,
            label: "Premium Courses",
            icon: `${config.client_url}/appMenuIcons/premium_courses.png`,
            page: "Premium_Courses",
            section: "section_1"
        },
        {
            _id: mongoose.Types.ObjectId('0chooseTheme'),
            order: 5,
            isVisible: true,
            label: "Choose Theme",
            icon: `${config.client_url}/appMenuIcons/choose_theme.png`,
            page: "Choose_Theme",
            section: "section_2"
        },
        {
            _id: mongoose.Types.ObjectId('00chLanguage'),
            order: 6,
            isVisible: true,
            label: "Choose Language",
            icon: `${config.client_url}/appMenuIcons/choose_language.png`,
            page: "Choose_Language",
            section: "section_2"
        },
        {
             _id: mongoose.Types.ObjectId('000myCourses'),
            order: 7,
            isVisible: true,
            label: "My Courses",
            icon: `${config.client_url}/appMenuIcons/my_courses.png`,
            page: "My_Courses",
            "isPublic": false,
            section: "section_3"
        },
        {
             _id: mongoose.Types.ObjectId('0000myQroups'),
            order: 8,
            isVisible: true,
            label: "My Groups",
            icon: `${config.client_url}/appMenuIcons/my_groups.png`,
            page: "My_Groups",
            section: "section_3"
        },
        {
             _id: mongoose.Types.ObjectId('0myWishlists'),
            order: 9,
            isVisible: true,
            label: "My Wishlists",
            icon: `${config.client_url}/appMenuIcons/my_wishlists.png`,
            page: "My_Wishlist",
            section: "section_3"
        },
        {
             _id: mongoose.Types.ObjectId('myDiscussion'),
            order: 10,
            isVisible: true,
            label: "My Discussions",
            icon: `${config.client_url}/appMenuIcons/my_discussions.png`,
            page: "My_Discussions",
            section: "section_3"
        },
        {
             _id: mongoose.Types.ObjectId('00myCalendar'),
            order: 11,
            isVisible: true,
            label: "My Calendar",
            icon: `${config.client_url}/appMenuIcons/my_calendar.png`,
            page: "My_Calendar",
            section: "section_3"
        },
        {
             _id: mongoose.Types.ObjectId('000myRewards'),
            order: 12,
            isVisible: true,
            label: "My Rewards",
            icon: `${config.client_url}/appMenuIcons/my_rewards.png`,
            page: "My_Rewards",
            section: "section_3"
        },
        {
             _id: mongoose.Types.ObjectId('00000myChats'),
            order: 13,
            isVisible: true,
            label: "My Chats",
            icon: `${config.client_url}/appMenuIcons/my_chats.png`,
            page: "My_Chats",
            section: "section_3"
        },
        {
             _id: mongoose.Types.ObjectId('0nPreference'),
            order: 14,
            isVisible: true,
            label: "Notification Preferences",
            icon: `${config.client_url}/appMenuIcons/notification_preference.png`,
            page: "Notification_preferences",
            section: "section_4"
        },
        {
             _id: mongoose.Types.ObjectId('00helpCenter'),
            order: 15,
            isVisible: true,
            label: "Help Center",
            icon: `${config.client_url}/appMenuIcons/help_center.png`,
            page: "Help_Center",
            section: "section_4"
        },
        {
             _id: mongoose.Types.ObjectId('privacyPolic'),
            order: 16,
            isVisible: true,
            label: "Privacy Policy",
            icon: `${config.client_url}/appMenuIcons/privacy_policy.png`,
            page: "Privacy_Policy",
            section: "section_4"
        },
        {
             _id: mongoose.Types.ObjectId('0000000legal'),
            order: 17,
            isVisible: true,
            label: "Legal",
            icon: `${config.client_url}/appMenuIcons/legal.png`,
            page: "Legal",
            section: "section_4"
        },
        {
             _id: mongoose.Types.ObjectId('0000settings'),
            order: 18,
            isVisible: true,
            label: "Settings",
            icon: `${config.client_url}/appMenuIcons/settings.png`,
            page: "Settings",
            section: "section_4"
        },
        {
             _id: mongoose.Types.ObjectId('000000logout'),
            order: 19,
            isVisible: true,
            label: "Logout",
            icon: `${config.client_url}/appMenuIcons/log_out.png`,
            page: "Logout",
            section: "section_4"
        }
    ]
}()