<?php
if (!defined('ABSPATH')) {
    exit;
}

class AC_Baslider {

    public function __construct() {
        add_action('wp_enqueue_scripts', [$this, 'enqueue_scripts']);

        add_action('acf/include_fields', [$this, 'register_acf_fields']);
    }

    // Enqueue styles and scripts
    public function enqueue_scripts() {
        wp_enqueue_style('acb-index-style', plugin_dir_url(__FILE__) . '../dist/index.css');
        wp_enqueue_script('acb-script', plugin_dir_url(__FILE__) . '../dist/baslider.js', array('jquery'), null, true);
    }

    // Register ACF fields programmatically using PHP
    public function register_acf_fields() {
        if (!function_exists('acf_add_local_field_group')) {
            return;
        }

        acf_add_local_field_group(array(
            'key' => 'group_6704f20ec7ccb',
            'title' => 'Before-After Slider Fields',
            'fields' => array(
                array(
                    'key' => 'field_6704f20f4f71f',
                    'label' => 'Before Image',
                    'name' => 'before_image',
                    'type' => 'image',
                    'return_format' => 'array',
                    'preview_size' => 'medium',
                    'library' => 'all',
                ),
                array(
                    'key' => 'field_6704f2434f720',
                    'label' => 'After Image',
                    'name' => 'after_image',
                    'type' => 'image',
                    'return_format' => 'array',
                    'preview_size' => 'medium',
                    'library' => 'all',
                ),
                array(
                    'key' => 'field_6704f2674f721',
                    'label' => 'Start Position',
                    'name' => 'start_position',
                    'type' => 'range',
                    'default_value' => 50,
                ),
                array(
                    'key' => 'field_67063fd438e9e',
                    'label' => 'Step',
                    'name' => 'step',
                    'type' => 'range',
                    'default_value' => 5,
                ),
                array(
                    'key' => 'field_670cdb9017647',
                    'label' => 'Mouse Follow',
                    'name' => 'mouse_follow',
                    'type' => 'true_false',
                    'default_value' => 0,
                ),
                array(
                    'key' => 'field_670cdecb473ba',
                    'label' => 'Click Position',
                    'name' => 'click_position',
                    'type' => 'true_false',
                    'default_value' => 0,
                ),
                array(
                    'key' => 'field_670ce8e784e31',
                    'label' => 'Auto Slide',
                    'name' => 'auto_slide',
                    'type' => 'true_false',
                    'default_value' => 0,
                ),
                array(
                    'key' => 'field_670ce8f284e32',
                    'label' => 'Slide Speed',
                    'name' => 'slide_speed',
                    'type' => 'number',
                    'instructions' => 'Speed in ms',
                    'conditional_logic' => array(
                        array(
                            array(
                                'field' => 'field_670ce8e784e31',
                                'operator' => '==',
                                'value' => '1',
                            ),
                        ),
                    ),
                    'default_value' => 3000,
                ),
                array(
                    'key' => 'field_670e656bd9feb',
                    'label' => 'Floating Labels',
                    'name' => 'floating_labels',
                    'type' => 'true_false',
                    'default_value' => 0,
                ),
            ),
            'location' => array(
                array(
                    array(
                        'param' => 'block',
                        'operator' => '==',
                        'value' => 'acf/acbaslider',
                    ),
                ),
            ),
            'menu_order' => 0,
            'position' => 'normal',
            'style' => 'default',
            'label_placement' => 'top',
            'instruction_placement' => 'label',
            'hide_on_screen' => '',
            'active' => true,
            'description' => '',
        ));
    }

}
