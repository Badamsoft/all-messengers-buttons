<?php
/**
 * Plugin Name: All Messengers Buttons
 * Plugin URI: https://wordpress.org/plugins/all-messengers-buttons/
 * Description: Add WhatsApp, Telegram, MAX, Viber, Signal and other messenger buttons in one stylish floating widget.
 * Version: 1.3.4
 * Author: badamsoft
 * Author URI: https://badamsoft.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: all-messengers-buttons
 * Domain Path: /languages
 */

if (!defined('ABSPATH')) {
    exit;
}

define('AMB_VERSION', '1.3.4');
define('AMB_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('AMB_PLUGIN_URL', plugin_dir_url(__FILE__));

class AllMessengersButtons {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        add_action('plugins_loaded', array($this, 'load_textdomain'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
        add_filter('script_loader_tag', array($this, 'add_module_type_to_react_script'), 10, 2);
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_assets'));
        add_action('wp_footer', array($this, 'render_widget'));
        add_shortcode('all_messengers', array($this, 'shortcode_handler'));
        add_action('wp_ajax_amb_save_settings', array($this, 'ajax_save_settings'));
    }

    public function load_textdomain() {
        load_plugin_textdomain('all-messengers-buttons', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }

    
    public function add_admin_menu() {
        add_menu_page(
            'All Messengers Buttons',
            'Messengers',
            'manage_options',
            'all-messengers-buttons',
            array($this, 'render_admin_page'),
            'dashicons-format-chat',
            30
        );
    }
    
    public function register_settings() {
        register_setting('amb_settings', 'amb_options', array('sanitize_callback' => array($this, 'sanitize_options')));
        
        $default_options = array(
            'position' => 'right-bottom',
            'offset' => 20,
            'display_mode' => 'everywhere',
            'primary_color' => '#6366f1',
            'hover_color' => '#4f46e5',
            'icon_style' => 'flat',
            'icon_size' => 56,
            'enable_animation' => true,
            'show_text' => false,
            'enable_analytics' => false,
            'event_category' => 'Messengers',
            'custom_css' => '',
            'messengers' => array(
                'whatsapp' => array('enabled' => true, 'value' => '', 'custom_icon' => ''),
                'telegram' => array('enabled' => true, 'value' => '', 'custom_icon' => ''),
                'viber' => array('enabled' => false, 'value' => '', 'custom_icon' => ''),
                'messenger' => array('enabled' => false, 'value' => '', 'custom_icon' => ''),
                'signal' => array('enabled' => false, 'value' => '', 'custom_icon' => ''),
                'wechat' => array('enabled' => false, 'value' => '', 'custom_icon' => ''),
                'line' => array('enabled' => false, 'value' => '', 'custom_icon' => ''),
                'discord' => array('enabled' => false, 'value' => '', 'custom_icon' => ''),
                'vk' => array('enabled' => false, 'value' => '', 'custom_icon' => ''),
                'max' => array('enabled' => true, 'value' => '', 'custom_icon' => ''),
            )
        );
        
        if (false === get_option('amb_options')) {
            add_option('amb_options', $default_options);
        }
    }
    
    public function enqueue_admin_assets($hook) {
        if ('toplevel_page_all-messengers-buttons' !== $hook) {
            return;
        }

        $assets_dir = AMB_PLUGIN_DIR . 'admin-react/assets/';
        $css_files   = glob($assets_dir . 'index-*.css');
        $js_files    = glob($assets_dir . 'index-*.js');

        if (!empty($css_files)) {
            wp_enqueue_style('amb-react-css', AMB_PLUGIN_URL . 'admin-react/assets/' . basename($css_files[0]), array(), AMB_VERSION);
        }
        if (!empty($js_files)) {
            wp_enqueue_script('amb-react-js', AMB_PLUGIN_URL . 'admin-react/assets/' . basename($js_files[0]), array(), AMB_VERSION, true);
        }
    }

    public function add_module_type_to_react_script($tag, $handle) {
        if ('amb-react-js' === $handle) {
            $tag = str_replace('<script ', '<script type="module" ', $tag);
        }
        return $tag;
    }
    
    public function enqueue_frontend_assets() {
        $options = get_option('amb_options');
        
        if (empty($options)) {
            return;
        }
        
        $display_mode = isset($options['display_mode']) ? $options['display_mode'] : 'everywhere';
        
        if ($display_mode === 'mobile' && !wp_is_mobile()) {
            return;
        }
        
        if ($display_mode === 'desktop' && wp_is_mobile()) {
            return;
        }
        
        wp_enqueue_style('amb-frontend-css', AMB_PLUGIN_URL . 'assets/css/frontend.css', array(), AMB_VERSION);
        wp_enqueue_script('amb-frontend-js', AMB_PLUGIN_URL . 'assets/js/frontend.js', array('jquery'), AMB_VERSION, true);
        
        wp_localize_script('amb-frontend-js', 'ambSettings', array(
            'enableAnalytics' => isset($options['enable_analytics']) ? $options['enable_analytics'] : false,
            'eventCategory' => isset($options['event_category']) ? $options['event_category'] : 'Messengers'
        ));
    }
    
    public function render_widget() {
        $options = get_option('amb_options');
        
        if (empty($options)) {
            return;
        }
        
        $display_mode = isset($options['display_mode']) ? $options['display_mode'] : 'everywhere';
        
        if ($display_mode === 'mobile' && !wp_is_mobile()) {
            return;
        }
        
        if ($display_mode === 'desktop' && wp_is_mobile()) {
            return;
        }
        
        include AMB_PLUGIN_DIR . 'templates/widget.php';
    }
    
    public function shortcode_handler($atts) {
        $options = get_option('amb_options');
        
        if (empty($options)) {
            return '';
        }
        
        ob_start();
        include AMB_PLUGIN_DIR . 'templates/widget.php';
        return ob_get_clean();
    }
    
    public function ajax_save_settings() {
        check_ajax_referer('amb_save_settings', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error(__('Insufficient permissions', 'all-messengers-buttons'));
        }
        
        // Sanitization happens in sanitize_options() called below
        // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
        $options = isset($_POST['options']) ? wp_unslash($_POST['options']) : array();

        if (is_string($options)) {
            $decoded = json_decode(wp_unslash($options), true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $options = $decoded;
            }
        }

        $options = $this->sanitize_options($options);
        
        update_option('amb_options', $options);
        
        wp_send_json_success(__('Settings saved successfully', 'all-messengers-buttons'));
    }

    private function sanitize_options($options) {
        if (!is_array($options)) {
            return array();
        }

        $options = wp_unslash($options);

        $allowed_positions = array('right-bottom', 'left-bottom', 'right-top', 'left-top', 'center-bottom');
        $allowed_display_modes = array('everywhere', 'mobile', 'desktop');
        $allowed_icon_styles = array('flat', 'gradient', 'neon', 'glassmorphism', 'outline');

        $clean = array();

        if (isset($options['position']) && in_array((string) $options['position'], $allowed_positions, true)) {
            $clean['position'] = (string) $options['position'];
        }

        if (isset($options['display_mode']) && in_array((string) $options['display_mode'], $allowed_display_modes, true)) {
            $clean['display_mode'] = (string) $options['display_mode'];
        }

        if (isset($options['offset'])) {
            $clean['offset'] = max(0, min(200, (int) $options['offset']));
        }

        if (isset($options['icon_size'])) {
            $clean['icon_size'] = max(24, min(200, (int) $options['icon_size']));
        }

        if (isset($options['icon_style']) && in_array((string) $options['icon_style'], $allowed_icon_styles, true)) {
            $clean['icon_style'] = (string) $options['icon_style'];
        }

        if (isset($options['primary_color'])) {
            $color = sanitize_hex_color((string) $options['primary_color']);
            if (!empty($color)) {
                $clean['primary_color'] = $color;
            }
        }

        if (isset($options['hover_color'])) {
            $color = sanitize_hex_color((string) $options['hover_color']);
            if (!empty($color)) {
                $clean['hover_color'] = $color;
            }
        }

        $clean['enable_animation'] = !empty($options['enable_animation']);
        $clean['show_text'] = !empty($options['show_text']);
        $clean['enable_analytics'] = !empty($options['enable_analytics']);

        $clean['working_hours_enabled'] = !empty($options['working_hours_enabled']);

        if (isset($options['working_hours_schedule']) && is_array($options['working_hours_schedule'])) {
            $days = array('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
            $schedule = array();
            foreach ($days as $day) {
                if (!isset($options['working_hours_schedule'][$day]) || !is_array($options['working_hours_schedule'][$day])) {
                    continue;
                }

                $day_cfg = wp_unslash($options['working_hours_schedule'][$day]);
                $enabled = !empty($day_cfg['enabled']);
                $start = isset($day_cfg['startTime']) ? sanitize_text_field((string) $day_cfg['startTime']) : '';
                $end = isset($day_cfg['endTime']) ? sanitize_text_field((string) $day_cfg['endTime']) : '';

                // Allow empty; otherwise expect HH:MM
                if ($start !== '' && !preg_match('/^\d{1,2}:\d{2}$/', $start)) {
                    $start = '';
                }
                if ($end !== '' && !preg_match('/^\d{1,2}:\d{2}$/', $end)) {
                    $end = '';
                }

                $schedule[$day] = array(
                    'enabled' => $enabled,
                    'startTime' => $start,
                    'endTime' => $end,
                );
            }

            $clean['working_hours_schedule'] = $schedule;
        }

        if (isset($options['event_category'])) {
            $clean['event_category'] = sanitize_text_field((string) $options['event_category']);
        }

        if (isset($options['custom_css'])) {
            $clean['custom_css'] = wp_kses_post((string) $options['custom_css']);
        }

        $allowed_messengers = array('whatsapp', 'telegram', 'viber', 'messenger', 'signal', 'wechat', 'line', 'discord', 'vk', 'max', 'comera', 'botim', 'imo');
        if (isset($options['messengers']) && is_array($options['messengers'])) {
            $clean['messengers'] = array();
            foreach ($options['messengers'] as $type => $messenger) {
                $type = (string) $type;
                if (!in_array($type, $allowed_messengers, true)) {
                    continue;
                }
                if (!is_array($messenger)) {
                    continue;
                }

                $messenger = wp_unslash($messenger);

                $m = array();
                $m['enabled'] = !empty($messenger['enabled']);
                $m['value'] = isset($messenger['value']) ? sanitize_text_field((string) $messenger['value']) : '';
                $m['custom_icon'] = isset($messenger['custom_icon']) ? esc_url_raw((string) $messenger['custom_icon']) : '';

                $clean['messengers'][$type] = $m;
            }
        }

        return $clean;
    }
    
    public function render_admin_page() {
        include AMB_PLUGIN_DIR . 'templates/admin-page-react.php';
    }
}

// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound -- Function is properly prefixed with amb_
function amb_init() {
    return AllMessengersButtons::get_instance();
}

add_action('plugins_loaded', 'amb_init');
