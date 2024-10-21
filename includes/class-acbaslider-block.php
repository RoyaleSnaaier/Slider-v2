<?php
if (!defined('ABSPATH')) {
    exit;
}

class AC_Baslider_Block {

    public function __construct() {
        // Hook to register ACF block
        add_action('acf/init', [$this, 'register_acf_block']);
    }

    // Register ACF Block
    public function register_acf_block() {
        if (function_exists('acf_register_block')) {
            acf_register_block(array(
                'name'              => 'acbaslider',
                'title'             => __('AC: Before After Slider', 'acbaslider'),
                'description'       => __('A before-after slider block using ACF.', 'acbaslider'),
                'render_callback'   => [$this, 'render_acf_block'],
                'category'          => 'formatting',
                'icon'              => 'images-alt2',
                'keywords'          => array('before', 'after', 'slider'),
                'supports'          => array(
                    'align' => true,
                ),
                'enqueue_assets' => [$this, 'enqueue_block_assets']
            ));
        }
    }

    // Enqueue block-specific styles and scripts
    public function enqueue_block_assets() {
        wp_enqueue_style('acba-style', plugin_dir_url(__FILE__) . '../index.css');
        wp_enqueue_script('acba-script', plugin_dir_url(__FILE__) . '../script.js', [], null, true);
    }

    // Render ACF block callback
    public function render_acf_block($block) {
        $before_image = get_field('before_image');
        $after_image = get_field('after_image');
        $start_position = get_field('start_position') ?: 50;
        $step = get_field('step') ?: 5;
        $mouse_follow = get_field('mouse_follow') ?: false;
        $click_position = get_field('click_position') ?: false;
        $auto_slide = get_field('auto_slide') ?: false;
        $slide_speed = get_field('slide_speed') ?: 3000;
        $floating_labels = get_field('floating_labels') ?: false;
    
        if ($before_image && $after_image) {
            ?>
            <div 
                data-component="beforeafterslider" 
                class="acbaslider" 
                data-startingposition="<?php echo esc_attr($start_position); ?>" 
                data-step="<?php echo esc_attr($step); ?>"
                data-mousefollow="<?php echo esc_attr($mouse_follow ? 'true' : 'false'); ?>"
                data-clickposition="<?php echo esc_attr($click_position ? 'true' : 'false'); ?>"
                data-autoslide="<?php echo esc_attr($auto_slide ? 'true' : 'false'); ?>" 
                data-slidespeed="<?php echo esc_attr($slide_speed); ?>"
                data-floating-labels="<?php echo esc_attr($floating_labels ? 'true' : 'false'); ?>"
            >
                <div class="acbaslider__images">
                    <img class="acbaslider__images__img" src="<?php echo esc_url($before_image['url']); ?>" data-image="1" alt="<?php _e('Before', 'acbaslider'); ?>">
                    <img class="acbaslider__images__img" src="<?php echo esc_url($after_image['url']); ?>" data-image="2" alt="<?php _e('After', 'acbaslider'); ?>">
                </div>
    
                <!-- Labels for when JS is disabled (always visible) -->
                <div class="acbaslider__labels">
                    <span class="acbaslider__labels__label --before"><?php _e('Before', 'acbaslider'); ?></span>
                    <div class="acbaslider__labels__separator"></div>
                    <span class="acbaslider__labels__label --after"><?php _e('After', 'acbaslider'); ?></span>
                </div>
            </div>
            <?php
        }
    }
}    