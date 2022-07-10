import { GetStaticProps } from 'next';

import Head from 'next/head';
import SubscribeButton from '../components/SubscribeButton';
import { stripe } from '../services/stripe';
import styles from './home.module.scss';

interface HomeProps {
	product: {
		priceId: string;
		amount: number;
		recurring: {
			interval: string;
		};
	};
}

export default function Home({ product }: HomeProps) {
	return (
		<>
			<Head>
				<title>Home | ig news</title>
			</Head>
			<main className={styles.contentContainer}>
				<section className={styles.hero}>
					<span>👏 Hey, welcome</span>
					<h1>
						News about the <span>React</span> world.
					</h1>
					<p>
						Get access to all the publications <br />
						<span>
							for {product.amount} {product.recurring.interval}
						</span>
					</p>
					<SubscribeButton priceId={product.priceId} />
				</section>
				<img src="/images/avatar.svg" alt="Girl coding" />
			</main>
		</>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	const price = await stripe.prices.retrieve('price_1LK6h0Ki5yeMJtSKSjVbRPFl');

	const product = {
		priceId: price.id,
		amount: new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(price.unit_amount / 100),
		currency: price.currency,
		recurring: {
			interval: price.recurring.interval,
		},
	};

	return {
		props: {
			product,
		},
		revalidate: 60 * 60 * 24, // 24 hours
	};
};
