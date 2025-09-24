-- Database initialization script for EchoGrid
-- This runs when the PostgreSQL container starts for the first time

-- Enable PostGIS extension for geospatial features (if available)
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- Create additional indexes for performance
-- These will be created by Drizzle migrations, but useful for manual setup

-- Create a function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Insert some sample conservation areas for testing
INSERT INTO conservation_areas (id, name, type, risk_level, managing_organization, created_at) 
VALUES 
  (gen_random_uuid(), 'Maasai Mara National Reserve', 'national_park', 'high', 'Kenya Wildlife Service', NOW()),
  (gen_random_uuid(), 'Amboseli National Park', 'national_park', 'medium', 'Kenya Wildlife Service', NOW()),
  (gen_random_uuid(), 'Tsavo East National Park', 'national_park', 'high', 'Kenya Wildlife Service', NOW()),
  (gen_random_uuid(), 'Ol Pejeta Conservancy', 'conservancy', 'medium', 'Ol Pejeta Conservancy Ltd', NOW()),
  (gen_random_uuid(), 'Laikipia Community Land', 'community_land', 'low', 'Local Community', NOW())
ON CONFLICT DO NOTHING;

-- Insert sample ranger users for testing
INSERT INTO users (id, phone_number, name, role, location, trust_score, registered_at)
VALUES
  (gen_random_uuid(), '+254700123456', 'John Kamau', 'ranger', 'Maasai Mara', 95.00, NOW()),
  (gen_random_uuid(), '+254700123457', 'Mary Wanjiku', 'ranger', 'Amboseli', 88.50, NOW()),
  (gen_random_uuid(), '+254700123458', 'Peter Kiprotich', 'admin', 'Nairobi HQ', 100.00, NOW()),
  (gen_random_uuid(), '+254700123459', 'Grace Nyong', 'ngo', 'Tsavo', 92.00, NOW())
ON CONFLICT DO NOTHING;

-- Create useful views for reporting
CREATE OR REPLACE VIEW recent_reports AS
SELECT 
  r.id,
  r.type,
  r.priority,
  r.latitude,
  r.longitude,
  r.description,
  r.verification_status,
  r.reported_at,
  u.phone_number as reporter_phone,
  u.trust_score as reporter_trust_score,
  ca.name as conservation_area_name
FROM reports r
LEFT JOIN users u ON r.reporter_id = u.id
LEFT JOIN conservation_areas ca ON r.conservation_area_id = ca.id
WHERE r.reported_at > NOW() - INTERVAL '30 days'
ORDER BY r.reported_at DESC;

CREATE OR REPLACE VIEW threat_hotspots AS
SELECT 
  ROUND(CAST(latitude AS NUMERIC), 2) as lat,
  ROUND(CAST(longitude AS NUMERIC), 2) as lng,
  COUNT(*) as incident_count,
  ARRAY_AGG(DISTINCT type) as threat_types,
  MAX(reported_at) as latest_incident
FROM reports 
WHERE latitude IS NOT NULL 
  AND longitude IS NOT NULL
  AND reported_at > NOW() - INTERVAL '90 days'
GROUP BY ROUND(CAST(latitude AS NUMERIC), 2), ROUND(CAST(longitude AS NUMERIC), 2)
HAVING COUNT(*) > 1
ORDER BY incident_count DESC;

-- Grant necessary permissions
GRANT SELECT ON recent_reports TO echogrid;
GRANT SELECT ON threat_hotspots TO echogrid;

-- Log initialization
DO $$
BEGIN
  RAISE NOTICE 'EchoGrid database initialized successfully! 🌿';
  RAISE NOTICE 'Sample data loaded for conservation areas and rangers.';
  RAISE NOTICE 'Views created: recent_reports, threat_hotspots';
END $$;