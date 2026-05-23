<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- Template file included from function scope
if (!defined('ABSPATH')) {
    exit;
}

$bmb_options = get_option('bmb_options');

if (empty($bmb_options) || empty($bmb_options['messengers'])) {
    return;
}

$bmb_enabled_messengers = array_filter($bmb_options['messengers'], function($messenger) {
    return !empty($messenger['enabled']);
});

if (empty($bmb_enabled_messengers)) {
    return;
}

$bmb_position = isset($bmb_options['position']) ? $bmb_options['position'] : 'right-bottom';
$bmb_offset = isset($bmb_options['offset']) ? $bmb_options['offset'] : 20;
$bmb_primary_color = isset($bmb_options['primary_color']) ? $bmb_options['primary_color'] : '#6366f1';
$bmb_hover_color = isset($bmb_options['hover_color']) ? $bmb_options['hover_color'] : '#4f46e5';
$bmb_icon_size = isset($bmb_options['icon_size']) ? $bmb_options['icon_size'] : 56;
$bmb_enable_animation = isset($bmb_options['enable_animation']) ? $bmb_options['enable_animation'] : true;
$bmb_show_text = isset($bmb_options['show_text']) ? $bmb_options['show_text'] : false;
$bmb_custom_css = isset($bmb_options['custom_css']) ? $bmb_options['custom_css'] : '';
$bmb_working_hours_enabled = !empty($bmb_options['working_hours_enabled']);
$bmb_working_hours_schedule = isset($bmb_options['working_hours_schedule']) && is_array($bmb_options['working_hours_schedule']) ? $bmb_options['working_hours_schedule'] : array();

$bmb_position_class = 'bmb-position-' . $bmb_position;

$bmb_messenger_links = array(
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

$bmb_messenger_names = array(
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

<div class="bmb-messengers-widget <?php echo esc_attr($bmb_position_class); ?>"
     data-position="<?php echo esc_attr($bmb_position); ?>"
     data-offset="<?php echo esc_attr($bmb_offset); ?>"
     data-animation="<?php echo $bmb_enable_animation ? 'true' : 'false'; ?>"
     data-working-hours-enabled="<?php echo $bmb_working_hours_enabled ? 'true' : 'false'; ?>"
     data-working-hours-schedule='<?php echo esc_attr(wp_json_encode($bmb_working_hours_schedule)); ?>'>
    
    <div class="bmb-widget-buttons">
        <?php foreach ($bmb_enabled_messengers as $type => $messenger): 
            if (empty($messenger['value'])) continue;
            
            $bmb_link_template = isset($bmb_messenger_links[$type]) ? $bmb_messenger_links[$type] : '#';
            $bmb_raw_value = isset($messenger['value']) ? trim((string) $messenger['value']) : '';

            // Allow full links / schemes provided by user (e.g., comera://user/username or https://...)
            if (preg_match('~^[a-z][a-z0-9+\-.]*://~i', $bmb_raw_value) || strpos($bmb_raw_value, 'www.') === 0) {
                $bmb_link = $bmb_raw_value;
            } else {
                $bmb_value = $bmb_raw_value;
                if ($type === 'whatsapp') {
                    $bmb_value = preg_replace('/\D+/', '', (string) $bmb_value);
                }
                if ($type === 'telegram') {
                    $bmb_value = trim((string) $bmb_value);
                    $bmb_value = ltrim($bmb_value, '@');
                    if (preg_match('~(?:https?:\/\/)?t\.me\/([^\/?#]+)~i', $bmb_value, $m)) {
                        $bmb_value = $m[1];
                    }
                    if (preg_match('~tg:\/\/resolve\?domain=([^&]+)~i', $bmb_value, $m)) {
                        $bmb_value = $m[1];
                    }
                }
                $bmb_link = str_replace('{value}', urlencode($bmb_value), $bmb_link_template);
            }
            $bmb_name = isset($bmb_messenger_names[$type]) ? $bmb_messenger_names[$type] : ucfirst($type);
            $bmb_custom_icon = isset($messenger['custom_icon']) ? $messenger['custom_icon'] : '';
        ?>
        <a href="<?php echo esc_url($bmb_link); ?>" 
           class="bmb-messenger-btn" 
           data-messenger="<?php echo esc_attr($type); ?>"
           target="_blank"
           rel="noopener noreferrer"
           aria-label="<?php echo esc_attr($bmb_name); ?>">
            <div class="bmb-btn-icon">
                <?php if (!empty($bmb_custom_icon)): ?>
                    <img src="<?php echo esc_url($bmb_custom_icon); ?>" alt="<?php echo esc_attr($bmb_name); ?>" class="bmb-custom-icon">
                <?php else: 
                    $bmb_png_types = array('max', 'comera', 'botim');
                    $bmb_icon_ext = in_array($type, $bmb_png_types, true) ? '.png' : '.svg';
                    $bmb_icon_path = BMB_PLUGIN_DIR . 'assets/images/' . $type . $bmb_icon_ext;
                    $bmb_icon_ver = file_exists($bmb_icon_path) ? (string) filemtime($bmb_icon_path) : BMB_VERSION;
                    $bmb_icon_url = add_query_arg('v', $bmb_icon_ver, BMB_PLUGIN_URL . 'assets/images/' . $type . $bmb_icon_ext);
                ?>
                    <img src="<?php echo esc_url($bmb_icon_url); ?>" alt="<?php echo esc_attr($bmb_name); ?>" class="bmb-icon bmb-icon-<?php echo esc_attr($type); ?>">
                <?php endif; ?>
            </div>
            <?php if ($bmb_show_text): ?>
                <span class="bmb-btn-text"><?php echo esc_html($bmb_name); ?></span>
            <?php endif; ?>
        </a>
        <?php endforeach; ?>
    </div>

    <button class="bmb-toggle-btn" aria-label="<?php echo esc_attr__('Open messengers', 'badamsoft-messengers-buttons'); ?>">
        <svg class="bmb-icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"></path>
        </svg>
        <svg class="bmb-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    </button>
</div>
