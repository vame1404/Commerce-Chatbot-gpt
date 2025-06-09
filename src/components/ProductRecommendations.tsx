import type { GetProductRecommendationsOutput } from '@/ai/flows/product-recommendations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';

interface ProductRecommendationsProps {
  recommendationsData: GetProductRecommendationsOutput;
}

export default function ProductRecommendations({ recommendationsData }: ProductRecommendationsProps) {
  return (
    <Card className="mt-4 bg-card shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-headline text-card-foreground">Product Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold font-headline text-md text-card-foreground">Reasoning:</h4>
          <p className="text-sm text-card-foreground/80 font-body">{recommendationsData.reasoning}</p>
        </div>
        <div>
          <h4 className="font-semibold font-headline text-md text-card-foreground">Recommended Products:</h4>
          {recommendationsData.recommendedProducts && recommendationsData.recommendedProducts.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {recommendationsData.recommendedProducts.map((product, index) => (
                <li key={index} className="flex items-center p-2 rounded-md bg-background shadow">
                  <Package className="w-5 h-5 mr-3 text-accent" />
                  <span className="text-sm font-body text-foreground">{product}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-card-foreground/80 font-body">No specific recommendations at this time.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
