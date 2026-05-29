CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    pw_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(10) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_user_role
        CHECK (role in ('USER', 'ADMIN'))
);

CREATE TABLE IF NOT EXISTS devices(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    serial_num VARCHAR(100) UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'OFFLINE',
    is_enable BOOLEAN NOT NULL DEFAULT TRUE,
    last_seen TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_device 
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT check_user_status
        CHECK (status in ('OFFLINE', 'ONLINE'))
);

CREATE TABLE IF NOT EXISTS infos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL,
    temperature DOUBLE PRECISION,
    smoke DOUBLE PRECISION,
    gas DOUBLE PRECISION,
    flame DOUBLE PRECISION,
    sound DOUBLE PRECISION,
    light DOUBLE PRECISION,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_device_info 
        FOREIGN KEY (device_id)
        REFERENCES devices(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS alerts(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL,
    info_id UUID NOT NULL UNIQUE,
    level VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    risk INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ,
    CONSTRAINT fk_device_alert 
        FOREIGN KEY (device_id)
        REFERENCES devices(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_info_alert 
        FOREIGN KEY (info_id)
        REFERENCES infos(id)
        ON DELETE CASCADE,
    CONSTRAINT check_level
        CHECK(level in ('LOW', 'MEDIUM', 'HIGH')),
    CONSTRAINT check_risk 
        CHECK(risk >= 0 AND risk <= 100),
    CONSTRAINT check_alert_status
        CHECK(status in ('ACTIVE', 'RESOLVED', 'DISMISSED', 'SUPPRESSED'))
);

CREATE TABLE IF NOT EXISTS alert_history(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_id UUID NOT NULL,
    old_status VARCHAR(50) NOT NULL,
    new_status VARCHAR(50) NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_alert
        FOREIGN KEY (alert_id)
        REFERENCES alerts(id)
        ON DELETE CASCADE,
    CONSTRAINT check_old_status
        CHECK(old_status in ('ACTIVE', 'RESOLVED', 'DISMISSED', 'SUPPRESSED')),
    CONSTRAINT check_new_status
        CHECK(new_status in ('ACTIVE', 'RESOLVED', 'DISMISSED', 'SUPPRESSED'))
);

CREATE TABLE IF NOT EXISTS alert_suppressions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL,
    start_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_alert_suppression_device
        FOREIGN KEY (device_id)
        REFERENCES devices(id)
        ON DELETE CASCADE,
    CONSTRAINT check_alert_suppression_time
        CHECK (end_time > start_time)
);

CREATE TABLE IF NOT EXISTS notifications(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    alert_id UUID,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type VARCHAR(20) NOT NULL DEFAULT 'ALERT',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_notifications_alert
        FOREIGN KEY (alert_id)
        REFERENCES alerts(id)
        ON DELETE SET NULL,
    CONSTRAINT check_notifications_type
        CHECK (type IN ('ALERT', 'DEVICE', 'SYSTEM'))
);
-- Devices list of user
CREATE INDEX IF NOT EXISTS idx_devices_user_id
ON devices(user_id);
-- Sensor list of device
CREATE INDEX IF NOT EXISTS idx_infos_device_recorded_at
ON infos(device_id, recorded_at DESC);
-- Alert list of device 
CREATE INDEX IF NOT EXISTS idx_alerts_device_id
ON alerts(device_id);
-- Alert of sensor info
CREATE INDEX IF NOT EXISTS idx_alerts_info_id
ON alerts(info_id);
-- Filter alert status
CREATE INDEX IF NOT EXISTS idx_alerts_status
ON alerts(status);
-- Filter alert level
CREATE INDEX IF NOT EXISTS idx_alerts_level
ON alerts(level);
-- Sort for newset alert
CREATE INDEX IF NOT EXISTS idx_alerts_created_at
ON alerts(created_at DESC);
-- Suppression history 
CREATE INDEX IF NOT EXISTS idx_alert_suppressions_user_id
ON alert_suppressions(user_id);
-- Get newest notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_created_at
ON notifications(user_id, created_at DESC);
-- Get unread notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_is_read
ON notifications(user_id, is_read);