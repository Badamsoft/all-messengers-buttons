=== Badamsoft Messenger Buttons ===
Contributors: badamsoft
Tags: messenger, whatsapp, telegram, viber, widget
Requires at least: 5.0
Tested up to: 7.0
Requires PHP: 7.4
Stable tag: 1.3.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Add WhatsApp, Telegram, MAX, Viber, Signal and other messenger buttons in one stylish floating widget. Features a React-powered admin panel, working hours scheduler, and custom icons.

== Description ==

Badamsoft Messenger Buttons allows you to add a floating widget with messenger buttons to your WordPress site. Your visitors can easily contact you through their preferred messenger.

**What makes this plugin unique:**
* Working hours scheduler — widget automatically hides outside business hours
* Support for 13 messengers including MAX (Russian messenger), Comera, Botim, and IMO
* React-powered admin panel for a modern, smooth settings experience
* 5 icon styles: Flat, Gradient, Neon, Glassmorphism, Outline
* Custom icon upload for each individual messenger
* Analytics integration with Google Analytics 4 and Matomo
* Custom CSS support for advanced styling

**Supported Messengers:**
* WhatsApp
* Telegram
* MAX
* Viber
* Facebook Messenger
* Signal
* WeChat
* LINE
* Discord
* VK Messenger
* Comera
* Botim
* IMO

**Features:**
* Floating widget with customizable position
* Multiple messenger support
* Customizable colors and icon sizes
* Custom icon upload support
* Animation effects
* Mobile and desktop responsive
* Show/hide text labels under icons
* Custom CSS support
* Analytics integration (Google Analytics 4, Matomo)
* Working hours scheduler
* React-powered admin panel
* 5 icon styles (Flat, Gradient, Neon, Glassmorphism, Outline)

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/badamsoft-messenger-buttons` directory, or install the plugin through the WordPress plugins screen.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Go to Settings → Badamsoft Messenger Buttons to configure the plugin.
4. Enable the messengers you want to use and enter your contact details.
5. Customize the appearance and position of the widget.
6. Save your settings and the widget will appear on your site.

== Frequently Asked Questions ==

= How do I add a messenger button? =

Go to Settings → Badamsoft Messenger Buttons, navigate to the "Messengers" tab, enable the messenger you want to add, and enter your contact information (phone number, username, or link).

= Can I customize the widget colors? =

Yes! You can customize the primary color and hover color in the "Basic Settings" tab.

= Can I upload custom icons? =

Yes! Each messenger has an option to upload a custom icon. If you don't upload a custom icon, the default messenger icon will be used.

= How do I change the widget position? =

In the "Basic Settings" tab, you can choose from 5 positions: right bottom, left bottom, right top, left top, or center bottom.

= Can I hide the widget on mobile or desktop? =

Yes! In the "Basic Settings" tab, you can choose to display the widget everywhere, only on mobile, or only on desktop.

= How do I track clicks on messenger buttons? =

Enable analytics tracking in the "Advanced" tab and configure your Google Analytics or Matomo integration.

== Screenshots ==

1. Widget on the website
2. Basic settings page
3. Messengers configuration
4. Advanced settings

== Changelog ==

= 1.3.4 =
* Made the toggle button icon more rounded

= 1.3.3 =
* Fixed Telegram links when input is @username or full https://t.me/username

= 1.3.2 =
* Fixed WhatsApp wa.me links on mobile by converting phone to digits-only automatically

= 1.3.1 =
* Fixed toggle button shape in themes that override global button styles

= 1.3.0 =
* Removed preview widget from admin panel
* Removed top save button, kept only bottom save button
* Embedded default SVG icons for all messengers
* Custom icon upload support maintained
* Fixed widget positioning in preview

= 1.2.3 =
* Fixed widget visibility in admin preview
* Improved container sizing for better preview display
* Fixed overflow handling for widget positioning

= 1.2.0 =
* Fixed widget expansion direction (bottom-up for bottom positions, top-down for top positions)
* Removed colored backgrounds under messenger icons
* Made toggle button colored with primary/hover colors
* Messenger icons now use brand colors with transparent background
* Fixed "Show text under icon" toggle functionality

= 1.1.0 =
* Added support for 10 messengers
* Customizable widget position and colors
* Animation effects
* Custom CSS support
* Analytics integration

= 1.0.0 =
* Initial release

== External services ==

This plugin creates links to third-party messaging services. When a visitor clicks a messenger button, they are redirected to the corresponding service using the contact information you provide.

The following services are supported:
* WhatsApp (https://www.whatsapp.com/legal)
* Telegram (https://telegram.org/privacy)
* Viber (https://www.viber.com/terms/)
* Facebook Messenger (https://www.facebook.com/legal/terms)
* Signal (https://signal.org/legal/)
* WeChat (https://www.wechat.com/en/privacy_policy.html)
* LINE (https://terms.line.me/OWSP/ja/?lang=en)
* Discord (https://discord.com/terms)
* VK (https://vk.com/privacy)
* MAX (https://max.ru/privacy)
* Comera (https://comera.io/privacy)
* Botim (https://botim.me/privacy)
* IMO (https://imo.im/privacy.html)

No personal data is transmitted to these services other than the contact information you voluntarily configure in the plugin settings.

== Other Notes ==

Source code available on GitHub: https://github.com/Badamsoft/all-messengers-buttons

== Upgrade Notice ==

= 1.3.0 =
This version removes the preview widget from admin panel and embeds default messenger icons. Custom icons are still supported.

= 1.2.0 =
This version fixes widget expansion direction and icon display. Update recommended for better user experience.
