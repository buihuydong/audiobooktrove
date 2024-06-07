<template>
  <div class="mx-auto max-w-6xl mt-3 px-2 lg:px-0">
    <div class="flex flex-wrap justify-between">
      <BreadCrumb />
    </div>
    <div v-if="isData" class="p-2 rounded-md bg-white">
      <Fieldset legend="SecurityPolicy" :toggleable="true">
        <p class="m-0 px-3 text-sm" v-html="description.description"></p>
      </Fieldset>
    </div>
    <div v-if="!isData" class="flex justify-center">
      <ProgressSpinnerAudio class="my-5" />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    definePageMeta({
      middleware: "sound",
    });
  },
  data() {
    return {
      description: null,
      isData: false,
    };
  },
  mounted() {
    this.handleApi();
  },
  methods: {
    async handleApi() {
      try {
        const descriptionResponse = await $fetch('/api/policy/pay', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (descriptionResponse.data) {
          this.description = descriptionResponse.data.data;
          this.isData = true;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  }
}
</script>