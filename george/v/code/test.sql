select 
    msg.text,  
    user.name,
    concat(
        month(msg.date),
        '-',
        day(msg.date), 
        ' ',
        time_format(msg.date, '%H:%i')
    )as date,
    user.photo
from
    msg
    inner join member on member.member = msg.member
    inner join user on user.user = member.user
    inner join business on business.business = member.business
where 
    business.id = 'wanamlima'
order by
    msg.date asc;
