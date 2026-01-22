-- Migration: Create Inventory Transactions Table
-- Description: Track all inventory movements and adjustments

CREATE TABLE IF NOT EXISTS inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('adjustment', 'sale', 'return', 'restock', 'damage', 'transfer')),
    quantity INTEGER NOT NULL,
    previous_quantity INTEGER NOT NULL,
    new_quantity INTEGER NOT NULL,
    reference_id UUID, -- Order ID, Transfer ID, etc.
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory_transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_type ON inventory_transactions(type);
CREATE INDEX IF NOT EXISTS idx_inventory_created_at ON inventory_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_created_by ON inventory_transactions(created_by);

-- Enable RLS
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Inventory transactions viewable by authenticated users" 
    ON inventory_transactions FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Inventory transactions editable by authenticated users" 
    ON inventory_transactions FOR ALL 
    USING (auth.role() = 'authenticated');

-- Function to auto-update product stock_quantity
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products 
    SET stock_quantity = NEW.new_quantity,
        updated_at = NOW()
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update product stock
CREATE TRIGGER update_product_stock_trigger
    AFTER INSERT ON inventory_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_product_stock();
