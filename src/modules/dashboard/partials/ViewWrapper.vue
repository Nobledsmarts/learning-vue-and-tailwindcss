<template>
    <div class="wf-pb-10">
        <div class="wf-flex wf-flex-col md:wf-flex-row md:wf-pr-5 wf-bg-[#f3f4f6]">

            <!-- Left Sidebar -->
            <SidebarPartial />

            <!-- Content area  -->
            <ContentAreaPartial class="md:wf-ml-10 wf-overflow-hidden md:wf-pt-5">
                <template #header v-if="visibleHeader">
                    <HeaderPartial />
                </template>
                <slot></slot>
            </ContentAreaPartial>
            <!-- Right Sidebar -->
            <RightSidebarPartial />
        </div>
    </div>
</template>

<script setup lang="ts">
    import ContentAreaPartial from './ContentAreaPartial.vue';
    import SidebarPartial from './SidebarPartial.vue';
    import RightSidebarPartial from './RightSidebarPartial.vue';
    import HeaderPartial from './header/HeaderPartial.vue';

    defineProps<{visibleHeader:{default: true}}>()
</script>