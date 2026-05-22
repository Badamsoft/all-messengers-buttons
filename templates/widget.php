<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- Template file included from function scope
if (!defined('ABSPATH')) {
    exit;
}

$amb_options = get_option('amb_options');

if (empty($amb_options) || empty($amb_options['messengers'])) {
    return;
}

$amb_enabled_messengers = array_filter($amb_options['messengers'], function($messenger) {
    return !empty($messenger['enabled']);
});

if (empty($amb_enabled_messengers)) {
    return;
}

$amb_position = isset($amb_options['position']) ? $amb_options['position'] : 'right-bottom';
$amb_offset = isset($amb_options['offset']) ? $amb_options['offset'] : 20;
$amb_primary_color = isset($amb_options['primary_color']) ? $amb_options['primary_color'] : '#6366f1';
$amb_hover_color = isset($amb_options['hover_color']) ? $amb_options['hover_color'] : '#4f46e5';
$amb_icon_size = isset($amb_options['icon_size']) ? $amb_options['icon_size'] : 56;
$amb_enable_animation = isset($amb_options['enable_animation']) ? $amb_options['enable_animation'] : true;
$amb_show_text = isset($amb_options['show_text']) ? $amb_options['show_text'] : false;
$amb_custom_css = isset($amb_options['custom_css']) ? $amb_options['custom_css'] : '';
$amb_working_hours_enabled = !empty($amb_options['working_hours_enabled']);
$amb_working_hours_schedule = isset($amb_options['working_hours_schedule']) && is_array($amb_options['working_hours_schedule']) ? $amb_options['working_hours_schedule'] : array();

$amb_position_class = 'amb-position-' . $amb_position;

$amb_messenger_links = array(
    'whatsapp' => 'https://wa.me/{value}',
    'telegram' => 'https://t.me/{value}',
    'viber' => 'viber://chat?number={value}',
    'messenger' => 'https://m.me/{value}',
    'signal' => 'https://signal.me/#p/{value}',
    'wechat' => 'weixin://dl/chat?{value}',
    'line' => 'https://line.me/R/ti/p/{value}',
    'discord' => 'https://discord.com/invite/{value}',
    'vk' => 'https://vk.com/im?sel={value}',
    'max' => 'https://max.ru/{value}',
    'comera' => 'comera://chat?number={value}',
    'botim' => 'botim://chat?number={value}',
    'imo' => 'imo://chat?number={value}',
);

$amb_messenger_names = array(
    'whatsapp' => 'WhatsApp',
    'telegram' => 'Telegram',
    'viber' => 'Viber',
    'messenger' => 'Messenger',
    'signal' => 'Signal',
    'wechat' => 'WeChat',
    'line' => 'LINE',
    'discord' => 'Discord',
    'vk' => 'VK',
    'max' => 'MAX',
    'comera' => 'Comera',
    'botim' => 'Botim',
    'imo' => 'IMO'
);
?>

<?php if (!empty($amb_custom_css)): ?>
<style>
<?php echo wp_kses_post($amb_custom_css); ?>
</style>
<?php endif; ?>

<div class="all-messengers-widget <?php echo esc_attr($amb_position_class); ?>" 
     data-position="<?php echo esc_attr($amb_position); ?>" 
     data-offset="<?php echo esc_attr($amb_offset); ?>"
     data-animation="<?php echo $amb_enable_animation ? 'true' : 'false'; ?>"
     data-working-hours-enabled="<?php echo $amb_working_hours_enabled ? 'true' : 'false'; ?>"
     data-working-hours-schedule='<?php echo esc_attr(wp_json_encode($amb_working_hours_schedule)); ?>'
     style="--amb-offset: <?php echo esc_attr($amb_offset); ?>px; --amb-primary-color: <?php echo esc_attr($amb_primary_color); ?>; --amb-hover-color: <?php echo esc_attr($amb_hover_color); ?>; --amb-icon-size: <?php echo esc_attr($amb_icon_size); ?>px;">
    
    <div class="amb-widget-buttons">
        <?php foreach ($amb_enabled_messengers as $type => $messenger): 
            if (empty($messenger['value'])) continue;
            
            $amb_link_template = isset($amb_messenger_links[$type]) ? $amb_messenger_links[$type] : '#';
            $amb_raw_value = isset($messenger['value']) ? trim((string) $messenger['value']) : '';

            // Allow full links / schemes provided by user (e.g., comera://user/username or https://...)
            if (preg_match('~^[a-z][a-z0-9+\-.]*://~i', $amb_raw_value) || strpos($amb_raw_value, 'www.') === 0) {
                $amb_link = $amb_raw_value;
            } else {
                $amb_value = $amb_raw_value;
                if ($type === 'whatsapp') {
                    $amb_value = preg_replace('/\D+/', '', (string) $amb_value);
                }
                if ($type === 'telegram') {
                    $amb_value = trim((string) $amb_value);
                    $amb_value = ltrim($amb_value, '@');
                    if (preg_match('~(?:https?:\/\/)?t\.me\/([^\/?#]+)~i', $amb_value, $m)) {
                        $amb_value = $m[1];
                    }
                    if (preg_match('~tg:\/\/resolve\?domain=([^&]+)~i', $amb_value, $m)) {
                        $amb_value = $m[1];
                    }
                }
                $amb_link = str_replace('{value}', urlencode($amb_value), $amb_link_template);
            }
            $amb_name = isset($amb_messenger_names[$type]) ? $amb_messenger_names[$type] : ucfirst($type);
            $amb_custom_icon = isset($messenger['custom_icon']) ? $messenger['custom_icon'] : '';
        ?>
        <a href="<?php echo esc_url($amb_link); ?>" 
           class="amb-messenger-btn" 
           data-messenger="<?php echo esc_attr($type); ?>"
           target="_blank"
           rel="noopener noreferrer"
           aria-label="<?php echo esc_attr($amb_name); ?>">
            <div class="amb-btn-icon">
                <?php if (!empty($amb_custom_icon)): ?>
                    <img src="<?php echo esc_url($amb_custom_icon); ?>" alt="<?php echo esc_attr($amb_name); ?>" class="amb-custom-icon">
                <?php else: 
                    $amb_png_types = array('max', 'comera', 'botim');
                    $amb_icon_ext = in_array($type, $amb_png_types, true) ? '.png' : '.svg';
                    $amb_icon_path = AMB_PLUGIN_DIR . 'assets/images/' . $type . $amb_icon_ext;
                    $amb_icon_ver = file_exists($amb_icon_path) ? (string) filemtime($amb_icon_path) : AMB_VERSION;
                    $amb_icon_url = add_query_arg('v', $amb_icon_ver, AMB_PLUGIN_URL . 'assets/images/' . $type . $amb_icon_ext);
                ?>
                    <img src="<?php echo esc_url($amb_icon_url); ?>" alt="<?php echo esc_attr($amb_name); ?>" class="amb-icon amb-icon-<?php echo esc_attr($type); ?>">
                <?php endif; ?>
            </div>
            <?php if ($amb_show_text): ?>
                <span class="amb-btn-text"><?php echo esc_html($amb_name); ?></span>
            <?php endif; ?>
        </a>
        <?php endforeach; ?>
    </div>

    <button class="amb-toggle-btn" aria-label="<?php echo esc_attr__('Open messengers', 'all-messengers-buttons'); ?>">
        <svg class="amb-icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"></path>
        </svg>
        <svg class="amb-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    </button>
</div>
