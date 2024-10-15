<?php
if (!defined('ABSPATH')) {
    exit;
}

class AC_Baslider {

    public function __construct() {
        // Hook to enqueue scripts and styles
        add_action('wp_enqueue_scripts', [$this, 'enqueue_scripts']);
        // ACF JSON import/export path
        add_filter('acf/settings/load_json', [$this, 'acf_json_load_path']);
    }

    // Enqueue styles and scripts
    public function enqueue_scripts() {
        wp_enqueue_style('acb-index-style', plugin_dir_url(__FILE__) . '../dist/index.css');
        wp_enqueue_script('acb-script', plugin_dir_url(__FILE__) . '../src/js/script.js', array('jquery'), null, true);
    }

    // ACF JSON import/export path
    public function acf_json_load_path($paths) {
        $paths = array(plugin_dir_path(__DIR__) . '/acf-json');
        return $paths;
    }
}
