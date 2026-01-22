-- Migration: Create Admin Management Tables
-- Description: Admin users, roles, and activity logging

-- Admin Roles Table
CREATE TABLE IF NOT EXISTS admin_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES admin_roles(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Activity Log Table
CREATE TABLE IF NOT EXISTS admin_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id UUID,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON admin_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON admin_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_action ON admin_activity_log(action);

-- Enable RLS
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admin roles viewable by authenticated users" 
    ON admin_roles FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admin roles editable by authenticated users" 
    ON admin_roles FOR ALL 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admin users viewable by authenticated users" 
    ON admin_users FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admin users editable by authenticated users" 
    ON admin_users FOR ALL 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Activity log viewable by authenticated users" 
    ON admin_activity_log FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Activity log insertable by authenticated users" 
    ON admin_activity_log FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

-- Triggers
CREATE TRIGGER update_admin_roles_updated_at 
    BEFORE UPDATE ON admin_roles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON admin_users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default roles
INSERT INTO admin_roles (name, description, permissions) VALUES
    ('Super Admin', 'Full system access', '{"all": true}'::jsonb),
    ('Admin', 'Standard admin access', '{"products": true, "orders": true, "customers": true}'::jsonb),
    ('Manager', 'Limited management access', '{"products": true, "orders": true}'::jsonb),
    ('Editor', 'Content management only', '{"cms": true, "blog": true}'::jsonb),
    ('Viewer', 'Read-only access', '{"view_only": true}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Function to log admin activity
CREATE OR REPLACE FUNCTION log_admin_activity()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO admin_activity_log (user_id, action, resource_type, resource_id, details)
    VALUES (
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
