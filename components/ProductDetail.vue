<template>
    <div class="flex flex-wrap gap-0 bg-white rounded-md shadow my-3 p-3">
        <div class="rounded-md overflow-hidden basis-full bg-white flex gap-3">
            <div class="flex gap-3 basis-full md:basis-7/12 lg:basis-9/12 items-start">
                <div class="flex flex-col justify-center gap-2 relative">
                    <div class="rounded-md w-40 lg:w-60 shadow overflow-hidden card_box_detail"
                        :style="promotionStyle(product)">
                        <img :src="product.image" class="w-full h-full object-cover" :alt="product.name" />
                    </div>
                    <Button :disabled="isLoad[product.audio_object_key]"
                        @click.prevent="toggleAudio(product.audio_object_key)"
                        class="button-row shadow cursor-pointer p-2 rounded-md" aria-label="button play audio">
                        <div :class="{ 'is-active': isActive[product.audio_object_key] }"
                            class="shadow button-au | button-au--toggle button-au--play">
                            <IconsPlay class="ph-play" />
                            <IconsPause class="ph-pause" />
                        </div>
                        <div v-if="!isLoad[product.audio_object_key]" class="text-xs">
                            {{ sampleTime[product.audio_object_key] === undefined ? 'Sample' :
                                sampleTime[product.audio_object_key] }}
                        </div>
                        <div v-if="isLoad[product.audio_object_key]">
                            <IconsTadpole />
                        </div>
                    </Button>
                </div>
                <div class="">
                    <div class="text-base lg:text-2xl text-left font-semibold my-2">
                        {{ product.name }}
                    </div>
                    <div class="text-xs lg:text-sm text-left font-normal my-2">
                        <span class="text-sub">By: </span>
                        <span class="text-main border-b-[1px] border-orange-500">{{ product.by }}</span>
                    </div>
                    <div class="text-xs lg:text-sm text-left font-normal my-2">
                        <span class="text-sub">Narrated by: </span>
                        <span class="text-main border-b-[1px] border-orange-500">{{ product.narrated_by }}</span>
                    </div>
                    <div v-if="product.series && product.series_number" class="text-sm text-left font-normal my-2">
                        <span class="text-sub">Series: </span>
                        <span class="text-main border-b-[1px] border-orange-500">
                            {{ product.series }}, {{ product.series_number }}
                        </span>
                    </div>
                    <div class="text-xs lg:text-sm text-left font-normal my-2">
                        <span class="text-sub">Length:</span> {{ product.length }}
                    </div>
                    <div class="text-xs lg:text-sm text-left font-normal my-2">
                        <span class="text-sub">Release date:</span> {{ formatDate(product.release_date) }}
                    </div>
                    <div class="text-xs lg:text-sm text-left font-normal my-2">
                        <span class="text-sub">Language:</span> {{ product.language }}
                    </div>
                    <div v-if="product.publisher" class="text-xs lg:text-sm text-left font-normal my-2">
                        <span class="text-sub">Publisher: </span>
                        <span class="text-main border-b-[1px] border-orange-500">{{ product.publisher ?? '' }}</span>
                    </div>
                </div>
            </div>
            <div class="hidden lg:block md:basis-5/12 lg:basis-3/12">
                <div
                    class="text-sm text-center text-nowrap my-2 font-medium px-1 py-2 bg-white border-[1px] border-orange-500 rounded-full text-black shadow-md">
                    <div :class="{ 'line-through text-sub': discountedPrice[product.id] && !promotionExpired }">
                        Regular price ${{ product.price }}</div>
                    <div v-if="discountedPrice[product.id]" :class="{ 'line-through text-sub': promotionExpired }">
                        Reduced to ${{
                            discountedPrice[product.id] }}</div>
                </div>
                <div class="" v-if="countDown[product.id]">
                    <Countdown :endTime="countDown[product.id]" :productId="product.id" @expired="handleExpired" />
                </div>
                <Button :disabled="addCart[product.id] || checkCart[product.id] || inProfile[product.id]"
                    class="CartBtn my-1 w-full justify-center shadow" @click="handleAddToCart(product)"
                    aria-label="button add to cart">
                    <span class="IconContainer">
                        <IconsCart class="text-black" />
                    </span>
                    <span class="text-sm text-black text-nowrap">
                        <div class="flex items-center gap-1" v-if="!addCart[product.id] && !inProfile[product.id]">
                            Add to cart
                            <div class="mt-0.5" v-if="checkCart[product.id]">
                                <IconsTadpole />
                            </div>
                        </div>
                        <div class="flex items-center gap-1" v-if="inProfile[product.id]">
                            <IconsUser class="text-black" />In profile
                        </div>
                        <div class="flex items-center gap-2" v-if="addCart[product.id]">
                            <IconsCart class="text-black" />In cart
                        </div>
                    </span>
                </Button>
                <Button :disabled="checkCartBuy[product.id] || inProfile[product.id]"
                    class="BuyBtn my-1 w-full justify-center shadow" @click="handleBuyNow(product)">
                    <span class="IconContainer" aria-label="button buy now">
                        <IconsSend class="text-white" />
                    </span>
                    <span class="text-sm text-white text-nowrap">
                        <div class="flex items-center gap-1" v-if="!inProfile[product.id]">
                            Buy now
                            <div class="mt-0.5" v-if="checkCartBuy[product.id]">
                                <IconsTadpole />
                            </div>
                        </div>
                        <div class="flex items-center gap-1" v-if="inProfile[product.id]">
                            <IconsUser class="text-white" />In profile
                        </div>
                    </span>
                </Button>
            </div>
        </div>
        <div class="w-full lg:hidden block mt-2">
            <div
                class="text-xs text-center text-nowrap font-medium px-1 py-2 bg-white border-[1px] border-orange-500 rounded-full text-black shadow-md w-full">
                <div :class="{ 'line-through text-sub': discountedPrice[product.id] && !promotionExpired }">
                    Regular price ${{ product.price }}</div>
                <div v-if="discountedPrice[product.id]" :class="{ 'line-through text-sub': promotionExpired }">
                    Reduced to ${{
                        discountedPrice[product.id] }}</div>
            </div>
        </div>
        <div class="lg:hidden block w-full mt-1" v-if="countDown[product.id]">
            <Countdown class="text-center" :endTime="countDown[product.id]" :productId="product.id"
                @expired="handleExpired" />
        </div>
    </div>
    <div class="fixed bottom-0 bg-main border-t-[1px] py-2 shadow w-full z-[1000] lg:hidden block">
        <div class="flex gap-3 justify-end">
            <Button :disabled="addCart[product.id] || checkCart[product.id] || inProfile[product.id]"
                class="CartBtn my-1 w-1/3 justify-center shadow" @click="handleAddToCart(product)"
                aria-label="button add to cart">
                <span class="text-sm text-black text-nowrap">
                    <div class="flex items-center gap-1" v-if="!addCart[product.id] && !inProfile[product.id]">
                        Add to cart
                        <div class="mt-0.5" v-if="checkCart[product.id]">
                            <IconsTadpole />
                        </div>
                    </div>
                    <div class="flex items-center gap-1" v-if="inProfile[product.id]">
                        <IconsUser class="text-black" />In profile
                    </div>
                    <div class="flex items-center gap-2" v-if="addCart[product.id]">
                        <IconsCart class="text-black" />In cart
                    </div>
                </span>
            </Button>
            <Button :disabled="checkCartBuy[product.id] || inProfile[product.id]"
                class="BuyBtn my-1 mr-5  w-1/3 justify-center" @click="handleBuyNow(product)"
                aria-label="button buy now">
                <span class="text-sm text-white text-nowrap">
                    <div class="flex items-center gap-1" v-if="!inProfile[product.id]">
                        Buy now
                        <div class="mt-0.5" v-if="checkCartBuy[product.id]">
                            <IconsTadpole class="text-white" />
                        </div>
                    </div>
                    <div class="flex items-center gap-1" v-if="inProfile[product.id]">
                        <IconsUser class="text-white" />In profile
                    </div>
                </span>
            </Button>
        </div>
    </div>
</template>

<script>
import { Howl } from 'howler';
export default {
    props: {
        product: {
            type: Object,
        }
    },
    data() {
        return {
            isActive: {},
            remainingTime: {},
            timer: {},
            sampleTime: {},
            sound: {},
            isLoad: {},
            resumeTime: null,
            isLeaving: false,
            promotion: null,
            discountedPrice: [],
            countDown: [],
            addCart: [],
            promotionExpired: false,
            currentAudioKey: null,
            checkCart: [],
            checkCartBuy: [],
            inProfile: [],
        }
    },
    mounted() {
        this.handlePromotion();
        this.handleCheckCart();
    },
    methods: {
        toggleAudio(audioKey) {
            this.isLoad[audioKey] = true;
            if (!this.sound[audioKey]) {
                this.sound[audioKey] = new Howl({
                    src: [audioKey],
                    loop: false,
                    duration: 150000,
                    html5: true,
                    onload: () => {
                        this.startAudio(audioKey);
                    },
                });
            } else {
                this.startAudio(audioKey);
            }

            if (this.sound) {
                this.$store.dispatch('addToSound', this.sound);
            }

            this.currentAudioKey = audioKey;
        },
        startAudio(audioKey) {
            this.isLoad[audioKey] = false;
            if (this.sound[audioKey].playing()) {
                this.isActive[audioKey] = false;
                this.remainingTime[audioKey] = this.sound[audioKey].seek();
                this.sound[audioKey].pause();
                clearInterval(this.timer[audioKey]);
            } else {
                this.isActive[audioKey] = true;

                if (this.remainingTime[audioKey] !== null) {
                    this.remainingTime[audioKey] = 120 - this.remainingTime[audioKey];
                    if (isNaN(this.remainingTime[audioKey])) {
                        this.remainingTime[audioKey] = 120;
                    }
                } else {
                    this.remainingTime[audioKey] = this.sound[audioKey].duration;
                }

                this.sampleTime[audioKey] = this.formatTime(this.remainingTime[audioKey]);

                if (this.sampleTime[audioKey] == 'NaN:NaN') {
                    this.remainingTime[audioKey] = 120;
                    this.sampleTime[audioKey] = this.formatTime(this.remainingTime[audioKey]);
                }

                this.sound[audioKey].play();
                this.timer[audioKey] = setInterval(() => {
                    this.remainingTime[audioKey]--;
                    if (this.remainingTime[audioKey] >= 0) {
                        this.sampleTime[audioKey] = this.formatTime(this.remainingTime[audioKey]);
                    } else {
                        clearInterval(this.timer[audioKey]);
                        this.isActive[audioKey] = false;
                        this.sound[audioKey].stop();
                    }
                }, 1000);
            }
        },
        formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        },
        formatDate(time) {
            const date = new Date(time);
            const year = date.toLocaleString("default", { year: "numeric" });
            const month = date.toLocaleString("default", { month: "2-digit" });
            const day = date.toLocaleString("default", { day: "2-digit" });
            return `${day}/${month}/${year}`;
        },
        async handlePromotion() {
            try {
                const promotionResponse = await $fetch('/api/promotion', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                if (promotionResponse.data) {
                    this.promotion = promotionResponse.data.data;
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        promotionStyle(product) {
            if (!this.promotion) return {};

            const promotionUse = this.promotion.promotionUse.find(item => {
                try {
                    if (Array.isArray(item.product_id)) {
                        const cleanedProductId = product.id.toString().trim();
                        const cleanedProductIds = item.product_id.map(id => id.toString().trim());
                        return cleanedProductIds.includes(cleanedProductId);
                    } else {
                        return product.id === item.product_id;
                    }
                } catch (e) {
                    console.error("Error parsing JSON:", e);
                    return false;
                }
            });

            if (!promotionUse) return {};

            const promotion = this.promotion.promotion.find(item => item.id === promotionUse.promotion_id);
            if (!promotion) return {};

            const discount = promotion.discount;
            this.countDown[product.id] = promotion.end;
            this.discountedPrice[product.id] = parseFloat((product.price * (1 - discount / 100)).toFixed(2));

            return {
                '--promotion-content': `'Sale ${discount}%'`,
            };
        },
        async handleCheckCart() {
            try {
                const cartResponse = await $fetch('/api/cart', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                if (cartResponse.data) {
                    const cart = JSON.parse(cartResponse.data);
                    cart.forEach(item => {
                        this.addCart[item.id] = true;
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        async handleAddToCart(product) {
            this.checkCart[product.id] = true;
            const user = useSupabaseUser();
            if (user.value != undefined) {
                try {
                    const checkResponse = await $fetch('/api/cart/transaction', {
                        method: 'POST',
                        body: {
                            product_id: product.id,
                            profile_id: user.value.id
                        },
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })

                    if (!checkResponse.data.data) {
                        try {
                            const productResponse = await $fetch('/api/cart', {
                                method: 'POST',
                                body: {
                                    id: product.id
                                },
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            })
                            if (productResponse) {
                                this.checkCart[product.id] = false;
                                this.addCart[product.id] = true;
                                const cartCookie = useCookie('cart');
                                this.$store.dispatch('addToCart', cartCookie.value.length);
                            }
                        } catch (error) {
                            console.error('Error fetching data:', error);
                        }
                    } else {
                        this.checkCart[product.id] = false;
                        this.inProfile[product.id] = true;
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            } else {
                this.$router.push('/login');
            }
        },
        async handleBuyNow(product) {
            this.checkCartBuy[product.id] = true;
            const user = useSupabaseUser();
            if (user.value != undefined) {
                try {
                    const checkResponse = await $fetch('/api/cart/transaction', {
                        method: 'POST',
                        body: {
                            product_id: product.id,
                            profile_id: user.value.id
                        },
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })

                    if (!checkResponse.data.data) {
                        try {
                            const productResponse = await $fetch('/api/cart', {
                                method: 'POST',
                                body: {
                                    id: product.id
                                },
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            })
                            if (productResponse) {
                                this.checkCartBuy[product.id] = false;
                                this.addCart[product.id] = true;
                                const cartCookie = useCookie('cart');
                                this.$store.dispatch('addToCart', cartCookie.value.length);
                                this.$router.push('/cart');
                            }
                        } catch (error) {
                            console.error('Error fetching data:', error);
                        }
                    } else {
                        this.checkCartBuy[product.id] = false;
                        this.inProfile[product.id] = true;
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            } else {
                this.$router.push('/login');
            }
        },
        handleExpired(productId) {
            if (this.product.id = productId) {
                this.promotionExpired = true;
            }
        }
    }
}
</script>
