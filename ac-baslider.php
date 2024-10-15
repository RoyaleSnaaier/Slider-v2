<?php
/**
 * Plugin Name: AC Baslider
 * Plugin URI:  http://584701.klas4s23.mid-ica.nl/
 * Description: A simple WordPress plugin that implements a before-after slider using ACF.
 * Version:     1.0
 * Author:      Ingmar van Rheenen
 * Author URI:  http://584701.klas4s23.mid-ica.nl/
 * License:     GPL2
 * Text Domain: acbaslider
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Include necessary files
require_once plugin_dir_path(__FILE__) . 'includes/class-acbaslider.php';
require_once plugin_dir_path(__FILE__) . 'includes/class-acbaslider-block.php';

// Initialize the plugin
function ac_baslider_init() {
    new AC_Baslider();
    new AC_Baslider_Block();
}
add_action('plugins_loaded', 'ac_baslider_init');
