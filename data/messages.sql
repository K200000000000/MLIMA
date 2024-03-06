WITH
    users as (
        SELECT 
            user.* 
        FROM 
            member
            INNER JOIN user ON member.user = user.user
        WHERE 
            member.business = 48
    ),
    msg as (
        SELECT
            msg.*
        FROM
            msg
            INNER JOIN users ON msg.user = users.user
    )

SELECT * FROM msg
LIMIT 10;
;