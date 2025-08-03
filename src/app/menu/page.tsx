import React from 'react';
import SaladCard from '@/components/salads/SaladCard';

const dummySalads = [
	{
		id: '1',
		name: 'Salad Caesar Klasik',
		description:
			'Selada romaine segar, crouton, keju parmesan, dan saus Caesar creamy.',
		price: 55000,
		imageUrl: '/images/salads/caesar.jpg',
	},
	{
		id: '2',
		name: 'Salad Yunani',
		description:
			'Tomat, timun, paprika, bawang merah, zaitun, dan keju feta dengan saus vinaigrette.',
		price: 50000,
		imageUrl: '/images/salads/greek.jpg',
	},
	{
		id: '3',
		name: 'Salad Ayam Panggang',
		description:
			'Dada ayam panggang, selada, tomat ceri, alpukat, dan saus honey mustard.',
		price: 65000,
		imageUrl: '/images/salads/grilled-chicken.jpg',
	},
	{
		id: '4',
		name: 'Salad Quinoa',
		description:
			'Quinoa, buncis hitam, jagung, alpukat, paprika, dengan saus lime cilantro.',
		price: 60000,
		imageUrl: '/images/salads/quinoa.jpg',
	},
	{
		id: '5',
		name: 'Salad Buah Tropis',
		description:
			'Campuran buah-buahan segar seperti mangga, nanas, dan kiwi dengan saus yoghurt.',
		price: 45000,
		imageUrl: '/images/salads/tropical-fruit.jpg',
	},
];

export default function MenuPage() {
	return (
		<div className="bg-soft-grey py-12 min-h-screen">
			<div className="container mx-auto px-4">
				<h1 className="text-4xl font-bold text-deep-teal text-center mb-12">
					Pilihan Menu Salad Kami
				</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{dummySalads.map(salad => (
						<SaladCard
							key={salad.id}
							id={salad.id}
							name={salad.name}
							description={salad.description}
							price={salad.price}
							imageUrl={salad.imageUrl}
						/>
					))}
				</div>
			</div>
		</div>
	);
}