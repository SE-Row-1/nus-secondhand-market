package edu.nus.market.dao;

import edu.nus.market.pojo.Department;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentDao {
    @Select("SELECT * From department WHERE id = #{id}")
    Department getDepartById(int id);
}
