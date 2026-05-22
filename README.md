# All Messengers Buttons — WordPress Plugin

Add WhatsApp, Telegram, MAX, Viber, Signal and other messenger buttons in one stylish floating widget on your WordPress site.

## Description

All Messengers Buttons is a modern WordPress plugin that lets you easily add a floating widget with popular messenger buttons to your website. The plugin supports 11 messengers and offers extensive customization of the widget's appearance and behavior.

## Supported Messengers

1. **WhatsApp** — The world's most popular messenger
2. **Telegram** — Fast and secure messenger
3. **Viber** — Popular in Eastern Europe
4. **Facebook Messenger** — Facebook integration
5. **Signal** — Privacy-focused messenger
6. **WeChat** — Popular in China
7. **LINE** — Popular in Asia
8. **Discord** — For gaming and communities
9. **VK Messenger** — Russian social network
10. **MAX** — Russian messenger by Mail.ru
11. **IMO** — Free video calls and chat

## Features

### Basic Settings
- **5 widget positions**: right-bottom, left-bottom, right-top, left-top, center-bottom
- **Configurable offset**: 0–100 px from the edge
- **Responsive display**: show on all devices, mobile only, or desktop only

### Appearance
- **Color customization**: primary color and hover color
- **5 icon styles**: Flat, Gradient, Neon, Glassmorphism, Outline
- **Icon size**: 48–72 px
- **Animation**: smooth scale + fade effect when opening
- **Labels under icons**: optional messenger name display

### Messenger Setup
- **Enable / disable** each messenger individually
- **Contact details**: phone number, username, or a full link
- **Custom icons**: upload your own icon for any messenger
- **Hints**: inline examples and instructions for each messenger

### Advanced
- **Analytics**: Google Analytics and Matomo click-tracking integration
- **Custom CSS**: add your own styles for extra customization
- **Shortcode**: use `[all_messengers]` to embed the widget anywhere

## Installation

1. Upload the plugin folder to `/wp-content/plugins/`
2. Activate the plugin via the **Plugins** menu in WordPress
3. Navigate to **Messengers** in the admin sidebar
4. Configure the widget to your liking
5. Save your settings — the widget will appear automatically

## Usage

### Automatic floating widget
After activation and configuration the widget appears on every page according to your settings.

### Shortcode
Insert `[all_messengers]` into any post or page to display messenger buttons at a specific location.

## Messenger Link Formats

| Messenger | Example input |
|---|---|
| WhatsApp | `+79123456789` or `https://wa.me/79123456789` |
| Telegram | `@username` or `https://t.me/username` |
| Viber | `viber://chat?number=%2B79123456789` |
| Facebook Messenger | `username` or `https://m.me/username` |
| Signal | `+79123456789` or `https://signal.me/#p/+79123456789` |
| WeChat | `WeChat_ID` or `weixin://dl/chat?username` |
| LINE | `@username` or `https://line.me/R/ti/p/@username` |
| Discord | `invitecode` or `https://discord.com/invite/invitecode` |
| VK Messenger | `https://vk.com/im?sel=c1` or `vk://chat?id=ID` |
| MAX | `support_bot` or `https://max.ru/support_bot?start=payload` |
| IMO | `+79123456789` |

## Requirements

- WordPress 5.0+
- PHP 7.4+
- jQuery (bundled with WordPress)

## Plugin Structure

```
all-messengers-buttons/
├── all-messengers-buttons.php   # Main plugin file
├── assets/
│   ├── css/
│   │   ├── admin.css            # Admin panel styles
│   │   └── frontend.css         # Widget styles
│   ├── js/
│   │   ├── admin.js             # Admin panel JavaScript
│   │   └── frontend.js          # Widget JavaScript
│   └── images/                  # Default messenger SVG/PNG icons
├── languages/                   # Translation files (.pot)
├── templates/
│   ├── admin-page.php           # Admin page template
│   └── widget.php               # Widget template
├── readme.txt                   # WordPress.org readme
└── README.md                    # This file
```

## FAQ

**Q: How do I change the widget color?**  
A: Go to plugin settings → **Basic** tab → **Appearance** section and pick your colors.

**Q: Can I use custom icons?**  
A: Yes. Each messenger card has an **Upload icon** button to replace the default icon.

**Q: How do I hide the widget on mobile?**  
A: In the **Basic** tab → **Widget position** section, select **Desktop only** in the *Display on devices* field.

**Q: Is analytics supported?**  
A: Yes. Enable click tracking in the **Advanced** tab and configure your GA4 / Matomo event category.

## Support

If you have questions or found a bug, please open an issue on the repository or contact the developer at [badamsoft.com](https://badamsoft.com).

## License

GPL v2 or later — https://www.gnu.org/licenses/gpl-2.0.html

## Author

[badamsoft](https://badamsoft.com)

## Changelog

### 1.3.4
- Made the toggle button icon more rounded

### 1.3.3
- Fixed Telegram links when input is @username or full https://t.me/username

### 1.3.2
- Fixed WhatsApp wa.me links on mobile by converting phone to digits-only automatically

### 1.3.1
- Fixed toggle button shape in themes that override global button styles

### 1.3.0
- Removed preview widget from admin panel
- Embedded default SVG icons for all messengers
- Custom icon upload support maintained

### 1.2.0
- Fixed widget expansion direction
- Removed colored backgrounds under messenger icons
- Made toggle button colored with primary/hover colors

### 1.1.0
- Added support for 10 messengers
- Customizable widget position and colors
- Animation effects, Custom CSS, Analytics integration

### 1.0.0
- Initial release
