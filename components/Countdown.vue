<template>
    <div>
        <div v-if="timeLeft > 0 && !expired">
            <div
                class="text-center text-xs font-medium p-2 border-[1px] border-orange-500 rounded-md mt-1 shadow flex gap-3 justify-center">
                <div class="flex flex-col">
                    <div class="">{{ days }}</div>
                    <div class="">days</div>
                </div>
                <div class="flex flex-col">
                    <div class="">{{ hours }}</div>
                    <div class="">hours</div>
                </div>
                <div class="flex flex-col">
                    <div class="">{{ minutes }}</div>
                    <div class="">minutes</div>
                </div>
                <div class="flex flex-col">
                    <div class="">{{ seconds }}</div>
                    <div class="">seconds</div>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="text-center text-sm font-medium p-2 border-[1px] border-orange-500 rounded-md mt-1 shadow">
                Sale expires!
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        endTime: {
            type: String,
            required: true
        },
        productId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            timeLeft: this.calculateTimeLeft(),
            expired: false,
            seconds: 0,
            minutes: 0,
            hours: 0,
            days: 0,
            interval: null
        }
    },
    mounted() {
        this.startCountdown();
        this.formatTime(this.timeLeft);
    },
    beforeDestroy() {
        clearInterval(this.interval);
    },
    methods: {
        calculateTimeLeft() {
            const end = new Date(this.endTime).getTime();
            const now = new Date().getTime();
            return Math.max(end - now, 0);
        },
        startCountdown() {
            this.interval = setInterval(() => {
                this.timeLeft = this.calculateTimeLeft();
                this.formatTime(this.timeLeft);
                if (this.timeLeft <= 0) {
                    this.expired = true;
                    clearInterval(this.interval);
                    this.$emit('expired', this.productId);
                }
            }, 1000);
        },
        formatTime(ms) {
            this.seconds = Math.floor(ms / 1000) % 60;
            this.minutes = Math.floor(ms / (1000 * 60)) % 60;
            this.hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
            this.days = Math.floor(ms / (1000 * 60 * 60 * 24));
        }
    }
}
</script>