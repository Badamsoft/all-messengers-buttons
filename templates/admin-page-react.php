<?php
if (!defined('ABSPATH')) {
    exit;
}
?>
<div id="root"></div>
<script>
// Replace generated icons with correct messenger icons
window.bmbIconUrl = '<?php echo esc_url(BMB_PLUGIN_URL); ?>assets/images/';
window.bmbCorrectIcons = {
    'whatsapp': 'whatsapp.svg',
    'telegram': 'telegram.svg',
    'viber': 'viber.svg',
    'messenger': 'messenger.svg',
    'signal': 'signal.svg',
    'wechat': 'wechat.svg',
    'line': 'line.svg',
    'discord': 'discord.svg',
    'vk': 'vk.svg',
    'max': 'max.png',
    'comera': 'comera.png',
    'botim': 'botim.png',
    'imo': 'imo.svg'
};
</script>
