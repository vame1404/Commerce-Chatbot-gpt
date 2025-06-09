import type { GetProductRecommendationsOutput } from '@/ai/flows/product-recommendations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';

interface ProductRecommendationsProps {
  recommendationsData: GetProductRecommendationsOutput;
}

export default function ProductRecommendations({ recommendationsData }: ProductRecommendationsProps) {
  return (
    <Card className="mt-2 sm:mt-4 bg-card shadow-lg">
      <CardHeader className="p-3 sm:p-4">
        <CardTitle className="text-sm sm:text-base font-headline text-card-foreground">Product Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-4 pt-0">
        <div>
          <h4 className="font-semibold font-headline text-xs sm:text-sm text-card-foreground">Reasoning:</h4>
          <p className="text-xs sm:text-sm text-card-foreground/80 font-body">{recommendationsData.reasoning}</p>
        </div>
        <div>
          <h4 className="font-semibold font-headline text-xs sm:text-sm text-card-foreground">Recommended Products:</h4>
          {recommendationsData.recommendedProducts && recommendationsData.recommendedProducts.length > 0 ? (
            <ul className="mt-1 sm:mt-2 space-y-1 sm:space-y-2">
              {recommendationsData.recommendedProducts.map((product, index) => (
                <li key={index} className="flex items-center p-1.5 sm:p-2 rounded-md bg-background shadow">
                  <Package className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-accent flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-body text-foreground">{product}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs sm:text-sm text-card-foreground/80 font-body">No specific recommendations at this time.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
