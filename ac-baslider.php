<?php
/**
 * Plugin Name: AC Baslider
 * Plugin URI:  http://yourwebsite.com
 * Description: A simple WordPress plugin that implements a before-after slider using ACF.
 * Version:     1.0
 * Author:      Your Name
 * Author URI:  http://yourwebsite.com
 * License:     GPL2
 */

//  acf data export met local json
// start en step position

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Enqueue styles and scripts
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style('acb-index-style', plugin_dir_url(__FILE__) . 'index.css');
    wp_enqueue_script('acb-script', plugin_dir_url(__FILE__) . 'script.js', array('jquery'), null, true);
});

// Register ACF Block
add_action('acf/init', function() {
    // Ensure the function exists
    if (function_exists('acf_register_block')) {
        // Register a before-after slider block
        acf_register_block(array(
            'name'              => 'acbaslider',
            'title'             => __('AC: Before After Slider'),
            'description'       => __('A before-after slider block using ACF.'),
            'render_callback'   => 'acbaslider_block_render_callback',
            'category'          => 'formatting',
            'icon'              => 'images-alt2',
            'keywords'          => array('before', 'after', 'slider'),
            'supports'          => array(
                'align' => true,
            ),
            'enqueue_assets' => function() {
                wp_enqueue_style('acba-style', plugin_dir_url(__FILE__) . 'index.css');
                wp_enqueue_script('acba-script', plugin_dir_url(__FILE__) . 'script.js', [], null, true);
            }
        ));
    }
});

// Render callback function
function acbaslider_block_render_callback($block) {
    // Get the ACF fields
    $before_image = get_field('before_image');
    $after_image = get_field('after_image');
    $start_position = get_field('start_position');
    $steps = get_field('steps'); // Assuming 'steps' is the field name in ACF

    // Default values if ACF fields are empty
    if (!$start_position) $start_position = 50;
    if (!$steps) $steps = 5;

    // Ensure images are available
    if ($before_image && $after_image): ?>
        <div 
            data-component="beforeafterslider" 
            class="acbaslider" 
            data-startingposition="<?php echo esc_attr($start_position); ?>" 
            data-step="<?php echo esc_attr($steps); ?>"
        >
            <div class="acbaslider__images">
                <img class="acbaslider__images__img" src="<?php echo esc_url($before_image['url']); ?>" data-image="1" alt="Before">
                <img class="acbaslider__images__img" src="<?php echo esc_url($after_image['url']); ?>" data-image="2" alt="After">
            </div>
            <div class="acbaslider__labels">
                <span class="acbaslider__labels__label --before">Before</span>
                <div class="acbaslider__labels__separator"></div>
                <span class="acbaslider__labels__label --after">After</span>
            </div>
        </div>
    <?php endif;
}

