<?php
if (!defined('ABSPATH')) {
    exit;
}
?>
<div id="root"></div>
<script>
// Pass WordPress data to React app
window.wpAmbSettings = <?php echo wp_json_encode( get_option( 'amb_options', array() ) ); ?>;
window.wpAmbAjaxUrl = <?php echo wp_json_encode( admin_url( 'admin-ajax.php' ) ); ?>;
window.wpAmbNonce = <?php echo wp_json_encode( wp_create_nonce( 'amb_save_settings' ) ); ?>;
window.wpAmbPluginUrl = <?php echo wp_json_encode( AMB_PLUGIN_URL ); ?>;
window.wpAmbPluginVersion = <?php echo wp_json_encode( defined( 'AMB_VERSION' ) ? AMB_VERSION : '' ); ?>;
</script>
